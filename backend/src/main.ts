import express, { Application } from 'express';
import dotenv from 'dotenv';
import socketIo from 'socket.io';
import { createServer } from 'http';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';

import api from './routes/api.route'
import logger from './utils/logger.util';
import { Unauthorized } from './utils/error.util';
import { verifyJWT } from './services/auth.service';
import { AccessToken } from './utils/types.util';
import prisma from './utils/prisma.util';

//For env File 
dotenv.config();

const app: Application = express();
const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 8000;
const JWT_ACCESS_SECRET = String(process.env.JWT_ACCESS_SECRET)
const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD)

const userSockets = new Map<string, string>();

app.use('/', api)

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})



io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if(!token)
    return next(new Unauthorized("No token provided"));

  const decoded = verifyJWT<AccessToken>(token, JWT_ACCESS_SECRET);

  if(decoded === null) return next(new Unauthorized("Invalid token"))

  socket.data.token = decoded;

  userSockets.set(decoded.accountId, socket.id);
  next();
})

io.on('connection', (socket) => {
  logger.info(`User ${socket.data.token.user} connected`);

  socket.emit('message', { content: 'Connected to the websocket!' })

  socket.on('disconnect', () => {
    logger.info(`User ${socket.data.token.user} disconnected`);
    userSockets.delete(socket.data.token.accountId);
  })
})

const redisClient = createClient({
  url: `redis://:${REDIS_PASSWORD}@localhost:6379`
})

redisClient.on('error', (err) => logger.error(`REDIS: ${err}`));

redisClient.connect().then(async () => {
  redisClient.subscribe('submission_result', async (message) => {
    const data = JSON.parse(message);
    const submissionId = data.submissionId as string;
    const result = data.result as string;

    const submission = await prisma.submission.findUnique({ where: { id: submissionId }, include: { author: true } });
    if(!submission) return;

    const socketId = userSockets.get(submission!.author.id);

    if(!socketId) return;

    io.to(socketId).emit('alert', {
      type: result === 'Accepted' ? 'SUCCESS' : 'DANGER',
      title: result.toUpperCase(),
      text: `Solution for problem ${submission.problemId}`
    })
  })

  redisClient.subscribe('submission_status', async (message) => {
    const data = JSON.parse(message);
    const submissionId = data.submissionId as string;
    const details = data.details as string;

    const submission = await prisma.submission.findUnique({ where: { id: submissionId }, include: { author: true } });
    if(!submission) return;

    const socketId = userSockets.get(submission!.author.id);

    if(!socketId) return;

    io.to(socketId).emit('solution_status', {
      details
    })
  })
})

server.listen(port, host, () => {
  logger.info(`Server live at https://${host}:${port}`);
});
