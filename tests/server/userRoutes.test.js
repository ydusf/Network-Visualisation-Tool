const User = require('../../server/models/UserModel');
const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../../app');

describe('Register Route Tests', () => {
  test('Successful registration', async () => {
    jest.spyOn(User, 'create').mockResolvedValue({
      username: 'testuser',
    });
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser', password: 'somepassword' });

    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('/login');
  });

  test('Duplicate username error', async () => {
    const error = new Error('Duplicate Key');
    error.code = 11000;
    jest.spyOn(User, 'create').mockResolvedValue({ error });

    const response = await request(app)
      .post('/register')
      .send({ username: 'existinguser', password: 'testpass' });

    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('/login');
  });
});

describe('Login Route Tests', () => {
  test('Successful login', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({
      _id: '123',
      username: 'testuser',
      password: 'hashedpassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'mypassword' });

    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('/network');
    expect(response.headers['set-cookie'][0]).toMatch(/^token=.+; HttpOnly/);
  });

  test('Invalid username', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({ username: 'wronguser', password: 'anything' });

    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('/login?error=True');
  });

  test('Incorrect password', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({
      _id: '123',
      username: 'testuser',
      password: 'hashedpassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('/login?error=True');
  });
});
