const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require("helmet");
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const users = require('./Routes/users')
const post = require('./Routes/post');
const app = express();
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 4000;

dotenv.config({ path: "./config/config.env" })

app.use(express.static("public"));
app.set("view engine", 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

app.use('/api/users/', users);
app.use('/api/post/', post);

if(app.get('env') === 'development'){
    app.use(morgan('dev'));
    console.log('Morgan is enabled');
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(console.log("Connected to MongDB database"))
.catch((err) => console.log(err));

const server = app.listen(PORT, () => console.log(`Currently listening on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`));


process.on("unhandledRejection", (error, promise) => {
    console.log(`Error: ${error.message}`);
    server.close(() => process.exit(1));
})



var key =  `This my key KEY`