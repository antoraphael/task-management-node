import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { socketServer } from './socket/socketServer';

const startServer = async () => {
  await connectDatabase();

  const apiServer = http.createServer(app);
  apiServer.listen(env.httpPort, () => {
    console.log(`HTTP server listening on port ${env.httpPort}`);
  });

  socketServer.initialize();
};

void startServer();

