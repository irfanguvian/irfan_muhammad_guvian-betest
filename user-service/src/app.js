import express from 'express';
import { userRouter } from './infrastructure/express/routes/user.routes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import lodash from 'lodash';
import { Connection } from './infrastructure/database/connection.js';
import { v4 as uuidv4 } from 'uuid';
import redis from 'redis';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(express.json());
const connection = new Connection(mongoose,redis)

const diHash = {
    express,
    mongoose,
    clientRedis: connection.clientRedis,
    lodash,
    uuidv4,
    axios
}

app.use("/users", userRouter(diHash))

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
