const config = require('./config/config');
const logger = require('./config/logger');
const app = require('./app');
const http = require('http');
const passport = require('passport');
const { socketAuth } = require('./middlewares/auth');
const chatSocket = require('./chat.socket');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.use((socket, next) => {
  //Passport compatibale to express middleware
  //accepts three arguments req,res,next.
  //We are making IO middleware compatible by passing
  //an extra empty object
  passport.initialize()(socket, {}, next)
});

io.use(socketAuth());

chatSocket(io);



server.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
