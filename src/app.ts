import express from 'express';
import routes from './routes/routes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {dbconnect} from "./server"
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';
import drumcontainerRoutes from "./routes/drumContainer.route"
const app = express();
const port = 3000; // Set the desired port number
dotenv.config();

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your allowed origin(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

dbconnect()
app.use('/api', routes);
app.use("/drumContainer", drumcontainerRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
