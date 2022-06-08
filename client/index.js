"use strict";
import path from 'path';
import { fileURLToPath } from 'url';
import {mens} from '../ts-output/index.js';
import  IndexRoutes from './routes/init.routes.config.js';

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');

mens(envPath);

  
