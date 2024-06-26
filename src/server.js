require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const { MONGO_URI, PORT } = require('./config');

console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
