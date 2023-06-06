import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/users.js";
import productRoute from './routes/product.route.js';
import file from './routes/files.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
const CONNECTION_URL = process.env.DB_URL;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connections successfull");
});
app.use('/files', express.static('files'));
app.use("/api/users/", userRoute);
app.use("/api/products/", productRoute);
app.use('/api/file',file)


app.listen(port, () => console.log(`Ecommerce Listening on port ${port}`));
