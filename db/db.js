const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => console.log('Connection to DB is OK'))
        .catch(err => console.log('Error connecting to DB:', err));
}

module.exports = connectToDb;
