// const request = require('supertest');
// const app = require('../src/app');
// const { authService, tokenService } = require('../src/services');

// describe("I tests users API Endpoint with admin account", () => {
    
//   const user ={
//     name: "Shiv Dev",
//     email: "shiv.dev@example.com",
//     password: "password@123",
//     role: "user"
//   }

//   test('Throws an if logged in user has not admin role', async (done) => {

//     try {
//       const admin = { email: 'satyam.dwivedi@example.com', password: 'password@123' };
//       const currentUser = await authService.loginUserWithEmailAndPassword(admin.email, admin.password);
//       const tokens = await tokenService.generateAuthTokens(currentUser);
//       console.log(tokens);
//       const response = request(app)
//         .set('Authorization', `Bearer ${tokens.access.token}`)
//         .post('/v1/users/')
//         .send(user);

//       expect(response.status).toBe(403);
//       expect(response.body).toEqual({
//         code: 403,
//         message: "Forbidden"
//       });
//       done();
//     } catch (error) {
//       console.error(error);
//       done(error);
//     }   
//   });

//   test('Accepts userBody and creates a new user successfully if role is admin', async (done) => {

//     try {
//       const admin = { email: 'admin@example.com', password: 'password@123' };
//       const currentUser = await authService.loginUserWithEmailAndPassword(admin.email, admin.password);
//       const tokens = await tokenService.generateAuthTokens(currentUser);
//       console.log(tokens);
//       const response = request(app)
//         .set('Authorization', `Bearer ${tokens.access.token}`)
//         .post('/v1/users/')
//         .send(user);

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({
//         "id": "c4a0debc-13ff-48cd-9e1b-1f7788951644",
//         "name": "Sneha Sharma",
//         "email": "sneha.sharma@example.com",
//         "password": "password@123",
//         "role": "admin",
//         "updatedAt": "2023-02-19T19:14:07.000Z",
//         "createdAt": "2023-02-19T19:14:07.000Z"
//       });
//       done();
//     } catch (error) {
//       console.error(error);
//       done(error);
//     }   
//   });

// })