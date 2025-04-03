const express = require('express');
const dotenv = require('dotenv');
const setRoutes = require('./routes/dataRoutes');

dotenv.config();

const app = express();

app.use(express.json());

setRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});