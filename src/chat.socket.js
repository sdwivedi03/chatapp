const { messageService, groupService } = require('./services');
const { socketValidation } = require('./validations')
const httpStatus = require('http-status');
const {} = require('./utils/SocketError')
const logger = require('./config/logger');
const SocketError = require('./utils/SocketError');
const recipient = require('./models/recipient');
const onlineUsers = new Map();
module.exports = (io) => {
  
  
  io.on('connection', async (socket) => {    
    
    //Store socket id of user
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    //Send acknowledge to every user,
    //user is online 
    io.emit('online', userId);

    /**
     * Send recents chats to user on connection
     */
    try{
      io.to(socket.id).emit('recentChats', await messageService.getUsersRecentChat(userId))
    }catch{
      throw new SocketError(httpStatus.INTERNAL_SERVER_ERROR, 'Please try again!')
    }

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
    })

    /**
     * Messaging events starts from here
     */
    socket.on('newMessage', async (payload, callback) => {

      const messageBody = JSON.parse(payload);
      messageBody.senderId = userId;
      const {error, value} = socketValidation.saveMessage.validate(messageBody);

      if(error) {
        logger.error(error);
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return callback(new SocketError(httpStatus.BAD_REQUEST, errorMessage));
      }
      const message = await messageService.saveMessage(value);

      //Send newly created message to all recipients sender
      message.Recipients.forEach(recipient => {
        const recipientSocketId = onlineUsers.get(recipient.userId);
        if(recipientSocketId) io.to(recipientSocketId).emit('newMessage', message);
      });
      callback(message)
    })

    socket.on('editMessage', async (payload) => {
      await messageService.editMessageById(payload)
      logger.info(payload);
    })
  
    socket.on('deleteMessage', (payload) => {
      logger.info(payload);
    })

    socket.on('typing', (payload) => {
      socket.broadcast.emit('typing', payload)
    })
  
  
    socket.on('reactToMessage', (payload) => {
      logger.info(payload);
    })
  
    /**
     * Created a group
     */
    socket.on('createGroup', async (payload, callback) => {
      const groupBody = JSON.parse(payload);
      logger.info(groupBody);
      const {error, value} = socketValidation.createGroup.validate(groupBody);
      if(error) {
        logger.error(error);
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return callback(new SocketError(httpStatus.BAD_REQUEST, errorMessage));
      }
      groupBody.createdBy = userId;
      const group = await groupService.createGroup(groupBody);
      //  Send newly created group to all participants
      group.Participants.forEach(participant => {
        const participantSocketId = onlineUsers.get(participant.userId);
        if(participantSocketId) io.to(participantSocketId).emit('newGroup', group);
      });
      callback(group)
    })
  
    socket.on('addMember', (payload) => {
      logger.info(payload);
    })
  
    socket.on('removeMember', (payload) => {
      logger.info(payload);
    })
  
    socket.on('exitGroup', (payload) => {
      logger.info(payload);
    })
  
    socket.on('deleteGroup', (payload) => {
      logger.info(payload);
    })
  
  });
}