const morgan = require('morgan');
const { mongoose } = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');
const cookies = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const routes = require('./src/routes');
const { errorHandler, scheduleSystem } = require('./src/utils');
const corsOptions = require('./src/configs/corsOptions.config');
const socket = require('./src/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

async function bootstrap() {
  dotenv.config();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'src', 'public')));

  app.use(morgan('dev'));
  app.use(passport.initialize());
  app.use(cookies());
  app.use(cors(corsOptions));

  app.use(errorHandler);
  app.use('/api', routes);

  app.set('views', path.join(__dirname, 'src/public/views'));
  app.set(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'pug');
  app.set('trust proxy', true);

  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Database connection established');

  await scheduleSystem.defaultInit();

  socket.setup(io);

  server.listen(PORT, () => {
    console.log(`Server listening on ${BASE_URL}:${PORT}`);
  });
}

bootstrap();
