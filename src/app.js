import express from "express";
import { urlencoded, json } from "express";
import cors from "cors";
import corsOptions from "./configs/corsOptions.js";
import credentials from "./middlewares/credentials.js";
import cookieParser from "cookie-parser";

// Import Routes
import router from "./routes/index.routes.js";

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(urlencoded({ extended: false }));

// built-in middleware for json
app.use(json());

// middleware for cookies
app.use(cookieParser());

app.use(router);

const PORT = process.env.PORT || 5005;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
