require('dotenv').config();
const express = require('express');
const massive = require('massive');
// require session
const auth = require('./authController');
const {SERVER_PORT, CONNECTION_STRING} = process.env;

const app = express();
// Top level middleware
app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then( db => {
    app.set('db', db);
    console.log('Ahoy! Connected to db, matey')
}).catch( err => console.log(err));

// Enpoints

app.listen(SERVER_PORT, () => console.log(`Connected to port ${SERVER_PORT}⛵⚓`))
