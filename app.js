const express = require('express');
const config = require('config');
const mainRoute = require("./routes");
const pool = require('./config/db');
const app  = express();

app.use(express.json());

app.use("/api", mainRoute);

async function start() {
    try {
        const PORT = config.get("port") || 3030;
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}
start();