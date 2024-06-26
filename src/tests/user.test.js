const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(201);

        userId = res.body._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        token = loginRes.body.token;
    });

    it('should get user profile', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.email).toBe('test@example.com');
    });

    it('should get user questions', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}/questions`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
    });
});
