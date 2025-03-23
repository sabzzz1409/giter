import { Router } from "express";
import { Schema } from "mongoose";
import { basename } from 'path';
import { db } from "../scripts/db.js";

const dataSchema = new Schema({});

export const route = () =>
    Router().post(`/${basename(import.meta.url).slice(0, -3)}`,
        async (req, res) => {
            const data = req.body;

            console.log(data);
            // process.exit(0);

            try {
                const query1 = await db('angular', 'clis', dataSchema)
                    .find();
                //query here...
                res.status(200).json({ data: query1 });
            }
            catch (err) {
                console.error(err)
                res.status(500).json({ error: err });
            }
        }
    )
