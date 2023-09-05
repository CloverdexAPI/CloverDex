const request = require('supertest');
const app = require('../server/app'); // Replace with the actual path to your Express app
const { sequelize, User } = require('../server/models'); // Replace with the actual path to your database models

beforeAll(async () => {
  // Initialize or reset your database before running tests (e.g., migrate and seed)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after all tests
  await sequelize.close();
});

describe('POST /register', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
      elementType: 'example',
    };

    const response = await request(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', userData.name);
    expect(response.body).toHaveProperty('email', userData.email);
    // Add more assertions as needed
  });

  it('should handle user already exists', async () => {
    // Add a user to the database with the same email before running this test
    const existingUser = await User.create({
      name: 'Existing User',
      email: 'test@example.com',
      username: 'existinguser',
      password: 'existingpassword',
      elementType: 'example',
    });

    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
      elementType: 'example',
    };

    const response = await request(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already exists');
  });

});
