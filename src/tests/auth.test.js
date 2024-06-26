const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    let token;

    it('should create a new user and log in', async () => {
        await request(app)
            .post('/api/users')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(201);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        token = res.body.token;
        expect(token).toBeDefined();
    });

    it('should refresh the token', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ token })
            .expect(200);

        expect(res.body.token).toBeDefined();
    });
});
