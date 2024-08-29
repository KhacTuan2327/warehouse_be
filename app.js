const express = require('express');
const sequelize = require('./config/database');
const warehouseRoutes = require('./routes/warehouseRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const cors = require("cors")

const app = express();
var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: "Content-Range",
  };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', warehouseRoutes);
app.use('/api', sensorRoutes);


// Kết nối đến cơ sở dữ liệu
sequelize.sync()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
