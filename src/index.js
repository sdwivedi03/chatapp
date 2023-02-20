const config = require('./config/config');
const logger = require('./config/logger');
const app = require('./app');
const http = require('http');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const { auth, authSocket } = require('./middlewares/auth');
const chatSocket = require('./chat.socket');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.engine.use(passport.initialize());
passport.use('jwt', jwtStrategy);
io.engine.use(auth());
// io.engine.use(auth());
// io.use(auth());

io.on('error', (err) => {
  console.log('Server errror', err);
})

chatSocket(io);

// (async userId => await messageService.getAllRecentChatsForUser(userId))('sajhsjhajshj7');



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
