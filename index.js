const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

const Port = 6000;
app.listen(Port, () => {
    console.log(`Interview app listening on port ${port}`);
});