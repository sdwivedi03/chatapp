const { messageService } = require('./services');
const { socketValidation } = require('./validations')
const httpStatus = require('http-status');
const {} = require('./utils/SocketError')
const logger = require('./config/logger');
const SocketError = require('./utils/SocketError');
const onlineUsers = new Map();
module.exports = (io) => {
  
  
  io.on('connection', (socket) => {    
    
    console.log('New user connected: ',socket.id)
    // onlineUsers.set(userId, socket.id);
    socket.on('disconnect', () => {
      logger.info('User disconnected');
      // onlineUsers.delete(userId);
    })

    socket.on('error', (err) => {
      logger.info('User disconnected individual error', err);
      // onlineUsers.delete(userId);
    })
  
    socket.on('newMessage', async (payload, callback) => {
      const {error, value} = socketValidation.saveMessage.validate(payload);
      if(error) {
        console.log('errrr',error);
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return callback(new SocketError(httpStatus.BAD_REQUEST, errorMessage));
      }
      const message = await messageService.saveMessage(value);
      console.log('first payload: -- ',payload, 'second payload:---',message.id);
      //Send newly created message to everyone including sender
      io.emit('newMessage', payload);
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
  
    socket.on('newGroup', (payload) => {
      logger.info(payload);
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