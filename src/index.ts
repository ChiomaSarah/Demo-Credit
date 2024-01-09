const express = require("express");
const db = require("./database/db");
const authRoute = require("./routes/auth");
const walletRoute = require("./routes/wallet");

const app = express();

app.use(express.json());

app.use("/api", authRoute);

app.use("/api", walletRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
