import { Router } from "express";
import * as test from './servers/test.js'
import * as get_cli from "./servers/get_cli.js"
import * as add_cli from "./servers/add_cli.js"

export const routes = () => Router().use('/',
    test.route(),
    get_cli.route(), 
    add_cli.route(), 
);
