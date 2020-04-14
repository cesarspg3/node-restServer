require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use( require('./routes/user'));


mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err) => {
    if (err) throw err;
    console.log('bd online');
});
 
app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`)
});