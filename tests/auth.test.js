// const request = require('supertest');
// const app = require('../src/app');

// describe("POST /login", () => {
    
//     test('Returns refresh token and access token after successfull authentication', async (done) => {

//         try {
//             const admin = { email: "admin@example.com", password: 'password@13' };
//             const response = await request(app)
//             .post('/v1/auth/login')
//             .send(admin);
            
//             expect(response.status).toBe(401);
//             expect(response.body).toEqual({
//                 code: 401,
//                 message: "Incorrect email or password"
//             });
//             done();
//       } catch (error) {
//             done(error);
//       }   
//   });

// })