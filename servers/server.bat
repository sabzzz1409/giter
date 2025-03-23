@echo off
setlocal EnableDelayedExpansion

:: Check if argument is provided
if "%~1"=="" (
    echo Usage: server.bat [SERVER_NAME]
    exit /b
)

set "server=%~1"

(
echo import { Router } from "express";
echo import { Schema } from "mongoose";
echo import { basename } from "path";
echo import { db } from "../scripts/db.js";
echo.
echo const dataSchema = new Schema^({}^);
echo.
echo export const route = ^(^) =^>
echo     Router^(^).post^(`/${basename^(import.meta.url^).slice^(0, -3^)}`,
echo        async ^(req, res^) =^> {
echo.
echo            const data = req.body;
echo.
echo            console.log^(data^);
echo            // process.exit^(0^);
echo.
echo            try {
echo                const query1 = await db^('databse_name','collection_name',dataSchema^).find^(^);
echo                //query here...
echo                res.status^(200^).json^({ data: query1 }^);
echo            }
echo            catch ^(err^) {
echo                console.error^(err^)   
echo                res.status^(500^).json^({ error: err }^);
echo            }
echo        }
echo    ^)
) >> %server%.js

cd ..

(for /f "delims=" %%a in ('type "routes.js"') do (
    set "line=%%a"
    if "!line!"=="export const routes = () => Router().use('/'," (
        echo import * as %server% from "./servers/%server%.js"
        echo.
        echo export const routes = ^(^) =^> Router^(^).use^('/',
    ) else (
        echo !line!
    )
)) > "routes.js.tmp"

move /y "routes.js.tmp" "routes.js"

powershell -Command "(Get-Content 'routes.js') | Select-Object -SkipLast 1 | Set-Content 'routes.js'"
(
echo     %server%^.route^(^), 
echo ^);
) >> routes.js