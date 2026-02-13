const express = require("express");
const connectMongo = require("./config/mongo");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());

connectMongo();

app.use("/orders", orderRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));