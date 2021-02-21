import logger from "../logger";
logger.info('Loading dependencies...');
import * as dotenv from "dotenv";
dotenv.config()
import app from "../app";
import * as http from "http";
logger.info('Creating http server...');
const server = http.createServer(app);

const port = process.env['PORT'] || 3000;

server.listen(port, () => {
    logger.info(`Server started successfully on port ${port}`);
});
