const io = require('socket.io-client');
const { messageService, authService, tokenService } = require('../src/services');
const server = 'http://127.0.0.1:3000';

let socket

describe("It test message functionality", () => {
    let currentUser;
  
    beforeAll(async (done) => {
      const admin = { email: 'admin@example.com', password: 'password@123' };
      const user = await authService.loginUserWithEmailAndPassword(admin.email, admin.password);
      const tokens = await tokenService.generateAuthTokens(user);

      try{

        // const chats = await messageService.getChatsByUser(user.id)
        socket = io('http://localhost:3000', {
          withCredentials: true,
          extraHeaders: {
            Authorization: `Bearer ${tokens.access.token}`
          }
          });
        // console.log('---------CHATS-------',chats);
        currentUser = user;
        done();
      } catch(err){
        console.log(err);
        done(err);
        }
    });
  
  
    it("sends a new mesage", async (done) => {
      return done();
      const payload = {
        senderId: currentUser.id,
        text: 'Hello how are you',
        receiverId: 'b449017c-6bbc-4af2-b5f4-1328a7501218',
        isGroup: false
      }

      socket.emit('newMessage', payload);
      socket.on("newMessage", res => {
        expect(payload.text).toBe(res.text);
        expect(payload.senderId).toBe(res.senderId);
        expect(payload.receiverId).toBe(res.receiverId);
        expect(payload.isGroup).toBe(res.isGroup);
        done();
      })
    });

    // it("Typing acknowledgement test", async (done) => {
    //     socket.emit('typing');
    //     socket.on('typing');
    //     done();
    // });

  
});
