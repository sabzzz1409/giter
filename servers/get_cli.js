import { Router } from "express";
import { Schema } from "mongoose";
import { basename } from "path";
import { db } from "../scripts/db.js";

const dataSchema = new Schema({});

export const route = () =>
    Router().post(`/${basename(import.meta.url).slice(0, -3)}/:id?`,
        async (req, res) => {

            const data = req.body;
            const id = req.params.id;
            console.log(data);
            // process.exit(0);
            console.log(data.pageNumber * data.pageSize, data.pageSize)
            try {
                let query;
                let query2 = {};
                //edit
                if (id) {
                    query = await db('angular', 'cli', dataSchema)
                        .findOne({ i: parseInt(id) });
                }
                //get
                else {
                    query = await db('angular', 'cli', dataSchema)
                        .find().sort({ "i": "asc" })
                        .skip(data.pageNumber * data.pageSize)
                        .limit(data.pageSize);
                    query2 = await db('angular', 'cli', dataSchema)
                        .countDocuments()
                }

                res.status(200).json({ data: query, count: query2 });

            }
            catch (err) {
                console.error(err)
                res.status(500).json({ error: err });
            }
        }
    )
