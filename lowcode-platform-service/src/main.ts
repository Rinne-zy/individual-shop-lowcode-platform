import dotenv from 'dotenv';

import config from './config';
import runServer from './app';

dotenv.config();

runServer(config.server.port);