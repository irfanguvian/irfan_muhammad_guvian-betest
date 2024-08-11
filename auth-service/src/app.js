import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import lodash from 'lodash';
import { Connection } from './infrastructure/database/connection.js';
import { v4 as uuidv4 } from 'uuid';
import { authRouter } from './infrastructure/express/routes/auth.route.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());

const connection = new Connection(mongoose)

const diHash = {
    express,
    mongoose,
    lodash,
    axios,
    jwt,
    uuidv4
}

app.use("/auth", authRouter(diHash))

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
