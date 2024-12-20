// const dotenv = require('dotenv');
// // const { Server } = require('socket.io');
// const connectDatabase = require('./config/database');
// const app = require('./app');

// dotenv.config({ path: './config/.env' });

// connectDatabase();

// const port = process.env.PORT || 8080;

// const server = app.listen(port, () => console.log(`Server Started: http://localhost:${port}/`))

const dotenv = require('dotenv');
// const { Server } = require('socket.io');
const connectDatabase = require('./config/database');
const app = require('./app');

dotenv.config();

// Log all environment variables to check
//console.log("Loaded Environment Variables:", process.env);

connectDatabase();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => 
  console.log(`Server Started: http://localhost:${port}/`)
);
