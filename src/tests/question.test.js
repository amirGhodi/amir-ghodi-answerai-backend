const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Question Endpoints', () => {
    let token;
    let questionId;

    beforeAll(async () => {
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
    });

    it('should create a new question', async () => {
        const res = await request(app)
            .post('/api/questions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'What is the capital of France?'
            })
            .expect(201);

        questionId = res.body._id;
        expect(questionId).toBeDefined();
        expect(res.body.answer).toBeDefined();
    });

    it('should get the question by id', async () => {
        const res = await request(app)
            .get(`/api/questions/${questionId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.content).toBe('What is the capital of France?');
        expect(res.body.answer).toBeDefined();
    });
});
