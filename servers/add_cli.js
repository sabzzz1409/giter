import { Router } from "express";
import { Schema } from "mongoose";
import { basename } from "path";
import { db } from "../scripts/db.js";
import { type } from "os";

const dataSchema1 = new Schema({}, { strict: false });
const dataSchema2 = new Schema({
    cmd: { type: String, required: true },
    desc: { type: String, required: true },
    i: { type: Number, required: true, unique: true },
    link: { type: String, required: false },
    color: { type: String, required: false }
});

export const route = () =>
    Router().post(`/${basename(import.meta.url).slice(0, -3)}/:id?`,
        async (req, res) => {

            const data = req.body;
            const id = req.params.id
            console.log(data)
            console.log(id)
            // process.exit(0);

            try {
                let query2;
                let query3;

                //add
                if (id === '_') {
                    const query1 = await db('angular', 'clis', dataSchema1)
                        .find({}, { i: 1 })
                        .sort({ i: -1 })
                        .limit(1);

                    data.i = query1.length ? query1[0].get('i') + 1 : 1;

                    query2 = await db('angular', 'clis', dataSchema2)
                        .insertOne(data);
                    console.log('done here')
                }
                //edit
                if (!isNaN(Number(id))) {
                    query2 = await db('angular', 'clis', dataSchema2)
                        .updateOne({ i: Number(id) }, { $set: data });
                }
                if (isNaN(Number(id)) && id !== '_') {
                    //order change
                    if (data.dir !== undefined) {
                        let trip = 0;
                        while (true) {
                            trip += data.dir === '^' ? -1 : 1;
                            query3 = await db('angular', 'clis', dataSchema1).findOne({ i: data.ind + trip })
                            if (query3) break;
                        }
                        const bulkOps = [
                            { updateOne: { filter: { i: data.ind }, update: { $set: { i: -1 } } } },
                            { updateOne: { filter: { i: query3.i }, update: { $set: { i: data.ind } } } },
                            { updateOne: { filter: { i: -1 }, update: { $set: { i: query3.i } } } }
                        ];

                        query2 = await db('angular', 'clis', dataSchema1).bulkWrite(bulkOps);
                        console.log(query2);
                    }
                    //delete
                    else {
                        console.log('deletion')
                        query2 = await db('angular', 'clis', dataSchema1)
                            .deleteOne({ i: data.i });
                    }

                }

                res.status(200).json({ data: await query2 });

            }
            catch (err) {
                console.error(err)
                res.status(500).json({ error: err });
            }
        }
    )
