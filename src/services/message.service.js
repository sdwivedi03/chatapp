const httpStatus = require('http-status');
const { Op, col, where, fn, literal, QueryTypes } = require('sequelize');
const { Message, Recipient, Participant, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service')

/**
 * Get all conversation by user
 * @param {string} userId
 * @returns {Promise<Message[]>}
 */
const getUsersRecentChat = async (userId) => {

    const queryString = `
        SELECT 
        otherId, 
        text,
        latestTime,
        senderId,
        (SELECT name FROM Users WHERE Users.id = Messages.senderId) AS sender,
        (
            CASE
                WHEN isGroup THEN (SELECT name FROM \`Groups\` WHERE \`Groups\`.id = otherId)
                ELSE (SELECT name FROM Users WHERE Users.id = otherId)
            END
        ) as chatTitle
        FROM
            (
                SELECT 
                    (CASE
                        WHEN (Messages.senderId = :userId) THEN Messages.receiverId
                        ELSE Messages.senderId 
                    END) as otherId, 
                    MAX(sentAt) latestTime
                FROM Messages INNER JOIN Recipients ON Messages.id = Recipients.MessageId
                WHERE Messages.senderId = :userId OR Messages.receiverId = :userId
                GROUP BY otherId
            ) RecentChats

            INNER JOIN Messages 
                ON (
                    (RecentChats.otherId = Messages.senderId AND Messages.receiverId = :userId)
                    OR (RecentChats.otherId = Messages.receiverId AND Messages.senderId = :userId)
                ) AND Messages.sentAt = RecentChats.latestTime
        ORDER BY latestTime;
    `;
    return await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {userId}});
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
 * Get a message with id
 * @param {Object} messageId
 * @returns {Promise<User>}
 */
const getMessageById = async (messageId) => {
    const message = await Message.findByPk(messageId,{
        include: Recipient,
    });
    return message;
  };

/**
 * Create a new message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const saveMessage = async (messageBody) => {
    if(messageBody.isGroup){
        const recipients = await Participant.findAll({ 
            where: {
                groupId: messageBody.receiverId,
                userId: {
                    [Op.ne]: messageBody.senderId
                }

            }
        });
        if(!recipients) throw new ApiError(httpStatus.NOT_FOUND, 'No recipients found');
        const message = await Message.create(messageBody);
        await Recipient.bulkCreate(recipients.map(member => ({userId: member.userId, MessageId: message.id})))
        return await getMessageById(message.id);
    } else {
        const receiver = await getUserById(messageBody.receiverId);
        if(!receiver) throw new ApiError(httpStatus.NOT_FOUND, 'No recipients found');
        const message = await Message.create(messageBody);
        await Recipient.create({userId: message.receiverId, MessageId: message.id})
        return await getMessageById(message.id);
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
    getUsersRecentChat,
    getMessagesWithIndividual,
    getMessagesInGroup,
    getMessageById,
    saveMessage,
    editMessageById,
    deleteMessageById
};
