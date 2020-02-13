const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const users = require('./Routes/users')
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('api/users', users);

app.listen(PORT, () => console.log(`Currently listening on PORT ${PORT}`));


mongoose.connect('mongodb://localhost/hackerNews', { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log("Connected to MongDB database"))
.catch((err) => console.log(err));




