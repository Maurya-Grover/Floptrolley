const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const server = http.createServer(app);
dotenv.config();
const port = process.env.PORT;

console.log('Server Started');
server.listen(port);
