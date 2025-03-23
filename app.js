import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { routes } from './routes.js';

export const app = () => express()
    .use(json())
    .use(cors())
    .use('/nodeapp',routes())
    .use((err,_req,res,_next)=>(console.error(err),res.send('Internal server Error')));