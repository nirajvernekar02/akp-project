const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectToMongo = require('./config/db')
const app = express();
connectToMongo();
app.use(express.json());
app.use(cors());

app.use('/api/runner',require('./routes/runnerRoutes'));
app.use('/api/reading',require('./routes/readingRoutes'));
app.use('/api/user',require('./routes/userRoutes'));
const Port = process.env.PORT;
app.listen(Port, () => {
    console.log(`AKP app listening on port ${Port}`);
});