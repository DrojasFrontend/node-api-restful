'use strict'

// Env
require('dotenv').config();

var mongoose = require('mongoose');
var app = require('./app');
app.set('port', process.env.PORT || 3000);

// Colour console
var chalk = require('chalk');


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log(chalk.red.underline('Connected'));

        app.listen(app.set('port'), () => {
            console.log(chalk.blue.underline(`http://localhost:${app.get('port')}!`))
        })
    })
    .catch(err => {
        console.log(err)
    })