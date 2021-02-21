import * as express from "express";
import api from "./routes/api";
import logger from "./logger";

const app = express();

app.use(express.json())

// Register the api router with the Express application.
logger.info('Loading api routes...')
app.use('/api', api);

export default app;