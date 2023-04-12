require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const { errorHandler, notFoundHandler } = require("./errors/errorHandlers");
const userRoute = require("./routes/userRoutes");
const homeRoute = require("./routes/homeRoutes");
const authenticateToken = require("./middleware/authenticateToken")

// middleware
app.use(morgan("dev"));
app.use(express.json());

// homepage
app.use("/", homeRoute);

// users
app.use("/users", authenticateToken, userRoute);

// not found route
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Running on PORT : ${process.env.PORT}`);
});
