import mongoose from "mongoose";
export const db = (database, collection, schema) =>
    mongoose.createConnection(`${process.env.URI}${database}`).model(collection, schema);