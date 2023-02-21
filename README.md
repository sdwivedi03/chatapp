# Chat Applicaiton just created for demonstration purpose

It contains only backend of this project, that has been created using RESTful APIs using Node.js, Express as a framework of backend, Sequelize as ORM to query the database, mysql for storage and socketIO for the realtime communication.



## Features

1. Individual chat
2. Group chat
3. Group creation
4. Add or remove a member in group
5. Search a user in from users
6. User creation, update, delete and update
7. Authentication and Authorization


## Running the applicaiton:

**Locally**
```bash
npm run dev
```

**At production**

```bash
npm start
```

## Testing the applicaiton:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm test:watch

# run test coverage
npm coverage
```

## Environment Variables

I have created a sample file for environment variables as `.env.sample` you need to copy and paste it in `.env` file then modify according to your credentials.

## Project Structure

```
src\
 |--build\          # Views of chat applicaiton (Reactjs build files) 
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Sequelize models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--chat.socket.js  # Chats and groups socket.io events handler
 |--index.js        # App entry point

```
### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user


