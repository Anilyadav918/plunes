const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const morgan = require('morgan');

//load env variables
dotenv.config({path: './config/config.env'});

global.__basedir = __dirname + '/';
//connect to database
connectDB();

//routes files
const records = require('./routes/records');

const app = express();

//body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//MOunt routers
app.use('/api/v1/records', records);

app.get('/', (req, res) => {
  res.send('hello from server.js');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit
  server.close(() => process.exit(1));
});
