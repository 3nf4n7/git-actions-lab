const express = require('express');

const app = express();
const port = 8000;


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    express.json();
    next()
})

require('./routes')(app);


app.listen(port, () => {
    console.log('work')
})