import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';

class SocketServer {
  private io?: Server;

  initialize() {
    if (this.io) {
      return this.io;
    }

    const socketHttpServer = createServer();
    this.io = new Server(socketHttpServer, {
      cors: {
        origin: '*'
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    socketHttpServer.listen(env.socketPort, () => {
      console.log(`Socket server listening on port ${env.socketPort}`);
    });

    return this.io;
  }

  emit(event: string, payload: unknown) {
    this.io?.emit(event, payload);
  }
}

export const socketServer = new SocketServer();

