const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development:{
  port: process.env.PORT
  }
};