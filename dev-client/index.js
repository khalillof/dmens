"use strict";
import path from 'path';
import { fileURLToPath } from 'url';
import {dmens} from '../dmens/index.js';
import  IndexRoutes from './routes/init.routes.config.js';

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test.env');

dmens(envPath);


  
