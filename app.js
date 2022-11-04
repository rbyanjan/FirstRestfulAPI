/* when you run something from scripts, it looks in your node_modules first */
const express = require('express');
var cors = require('cors')
/* deal with all of the database stuff for us */
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//enable CORS for all routes
// app.use(cors()); 

//enable CORS for specific routes
var corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8083'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

if (process.env.ENV === 'Test') {
    console.log('This is test');
    const db = mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
    console.log('This is for PROD');
    /* using mongoosedb */
    //const db = mongoose.connect('mongodb://localhost/bookAPI-prod');
    const db = mongoose.connect('mongodb://localhost/bookAPI');
}

//const bookRouter = express.Router(); //moved to separate file
const port = process.env.PORT || 3000;
/* create book model */
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book); //() at the end means to execute this

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//wiring the router
app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API');
});

app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

module.exports = app;



