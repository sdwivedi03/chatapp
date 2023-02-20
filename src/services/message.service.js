const httpStatus = require('http-status');
const { Op, col, where, fn, literal, QueryTypes, query } = require('sequelize');
const { Message, Recipient, Participant } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service')

/**
 * Get all conversation by user
 * @param {string} userId
 * @returns {Promise<Message[]>}
 */
const getChatsByUser = async (userId) => {

    console.log('---------------------', userId);
    return Message.findAll({ 
        attributes: [
            [literal(`max(CASE 
                        WHEN Message.isGroup THEN (SELECT name FROM Group WHERE Group.id = Message.groupId)
                        WHEN Message.sender = ${userId} THEN (SELECT name FROM User WHERE User.id = Recepient.userId)
                        ELSE (SELECT name FROM User WHERE User.id = Message.sender)
                    END)`), 'title'],

            [literal(`max(CASE 
                        WHEN Message.sender != ${userId} AND Recepient.recievedAt THEN Recepient.recievedAt
                        ELSE Message.sentAt
                    END)`), 'time'],

            'sender', 
            'text'

        ],
        include: { model: Recipient, required: true }, 
        where: { 
            sentAt: 1
        },
        group: ['Message.sender', 'Recepient.userId'],
        order: [
            ['sentAt', 'DESC']    
        ],
    });

    const queryString = `
        SELECT * 
        FROM Messages 
        INNER JOIN (
            SELECT id 
            FROM Messages
            WHERE senderId = ${userId} OR re
            GROUP BY senderId, receiverId
        )
    `;

    return await query(queryString, {type: QueryTypes.SELECT})
};

/**
 * Get all message in conversation with inividual by userId
 * @param {string} userId
 * @param {string} conversationWith
 * @returns {Promise<Message []>}
 */
const getMessagesWithIndividual = async (userId, conversationWith) => {
    return Message.findAll({ 
        attributes: [
            '*',
            [literal(`SELECT name FROM Users WHERE id = Messages.senderId`, 'sender')],
        ],
        include: { model: Recipient, required: true, where: {isGroup: false} }, 
        where: { 
            [Op.or]: {
                [Op.and]: [
                    where(col('Message.senderId'), userId),
                    where(col('Recepient.userId'), conversationWith)
                ],
                [Op.and]: [
                    where(col('Message.senderId'), conversationWith),
                    where(col('Recepient.userId'), userId)
                ],
            }
        },
        order: [
            ['Message.sentAt', 'ASC']    
        ],
    });
};

/**
 * Fetches all message in group
 * @param {string} groupId
 * @returns {Promise<User>}
 */
const getMessagesInGroup = async (groupId) => {
    return Message.findAll({ 
        attributes: [
            '*',
            [literal(`SELECT name FROM Users WHERE id = Messages.senderId`), 'sender'],
        ],
        include: { model: Recipient, required: true }, 
        where: { 
            receiverId: groupId,
            isGroup: true
        },
        order: [
            ['sentAt', 'ASC']    
        ],
    });
};

/**
 * Get a new message with id
 * @param {Object} messageId
 * @returns {Promise<User>}
 */
const getMessageById = async (messageId) => {
    const message = await Message.findByPk({
        include: { model: Recipient, required: true },
        where: {id: messageId}});
        console.log('get message by id=====',message);
    return message;
  };

/**
 * Create a new message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const saveMessage = async (messageBody) => {
    
    if(messageBody.isGroup){
        const recipients = await Participant.findAll({groupId: messageBody.receiverId});
        console.log('reciepients----', recipients);
        if(!recipients) throw new ApiError(httpStatus.NOT_FOUND, 'No recipients found');
        const message = await Message.create(messageBody);
        await Recipient.bulkCreate(recipients.map(member => ({userId: member.userId, messageId: message.id})))
        return message;
    } else {
        const receiver = await getUserById(messageBody.receiverId);
        if(!receiver) throw new ApiError(httpStatus.NOT_FOUND, 'No recipients found');
        const message = await Message.create(messageBody);
        await Recipient.create({userId: message.receiverId, messageId: message.id})
        return message;
    }
};


/**
 * Update a meesgae text by id
 * @param {string} userId
 * @param {string} messageId
 * @param {string} newText
 * @returns {Promise<User>}
 */
const editMessageById = async (userId, messageId, newText) => {
  const message = await getMessageById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  } else if(message.sender != userId) {
    //Only sender can edit its message
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorised');
  }

  message.text = newText;
  await message.save();
  return message;
};

/**
 * Delete user by id
 * @param {ObjectId} messageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (currentUserId, messageId) => {
  const message = await getMessageById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  if(message.sender = currentUserId)
    //User is sender delete message for every user
    await Message.destroy({ where: { id: userId } });
  else {
    //User is receiver delete message for him only
    await Recipient.destroy({where: {messageId}})
  }
  return message;
};

module.exports = {
    getChatsByUser,
    getMessagesWithIndividual,
    getMessagesInGroup,
    getMessageById,
    saveMessage,
    editMessageById,
    deleteMessageById
};
