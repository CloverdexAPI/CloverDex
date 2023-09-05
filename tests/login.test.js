const request = require('supertest');
const app = require('../server/app'); // Replace with the actual path to your Express app
const { User } = require('../server/models'); // Replace with the actual path to your database models
const {sequelize} = require('../server/db'); 
const bcrypt = require("bcrypt");


beforeAll(async () => {
  // Initialize or reset your database before running tests (e.g., migrate and seed)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after all tests
  await sequelize.close();
});

describe('POST /login', () => {
  it('should log in a user with valid credentials', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
      elementType: 'example',
    };

    const registerResponse = await request(app)
      .post('/api/register')
      .send(userData);

    const loginData = {
      email: 'test@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    // Add more assertions as needed
  });

  it('should handle invalid password', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
      elementType: 'example',
    };

    const registerResponse = await request(app)
      .post('/api/register')
      .send(userData);

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword', // Provide an incorrect password
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid password');
  });

  it('should handle user not found', async () => {
    const loginData = {
      email: 'nonexistent@example.com', // Provide an email that doesn't exist
      password: 'password',
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  // Add more test cases for error handling, validation, etc.
});
