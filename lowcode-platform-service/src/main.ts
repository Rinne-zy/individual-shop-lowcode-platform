import config from './config';
import runServer from './app';
import initConnect from './db';
import type { MongodbConfig } from './db';

async function start() {
  await initConnect(config.mongodb as MongodbConfig);
  runServer(config.server.port);
}

start();