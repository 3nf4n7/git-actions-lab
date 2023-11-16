const fs = require('fs');
const path = require('path')
const express = require('express')
const client = require('mongoose');
const User = require('../models/User.js')

async function run() {
  try {
    console.log('here')
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect("mongodb+srv://123:123@cluster0.9ddrq4e.mongodb.net/?retryWrites=true&w=majority");
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

const urlencodedParser = express.urlencoded({ extended: false });
const regexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/s;
module.exports = function (app) {
    app.get('/', (req, res) => {
        res.end('hello');
    })
    app.get('/check-user-name', async (req, res) => {
        const username = req.query.name;
        const user = await User.findOne({username})

        let response = {}
        if (user && user.banStatus == "ALLOWED")
            response.result = 'Yes';
        else if (user && user.banStatus == "BANNED")
            response.result = 'BANNED';
        else
            response.result = 'No';

        if (user && user.passwordLimitation == 'LIMITED') {
            response.passwordLimit = true
            if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\+\-\*\/])/su.test(user.password))
                response.passwordLimitation = 'OK';
            else
                response.passwordLimitation = 'BAD';
        }
        else
            response.passwordLimitation = 'OK';

        res.json(response)
    })
    app.post('/registration', urlencodedParser, async (req, res) => {
        let userData = JSON.parse(req.headers.body);

        console.log(userData)

        userData.name = userData.username;

        if (userData.username == "ADMIN")
            userData.role = 'ADMIN'
        else
            userData.role = 'USER'

        userData.banStatus = 'ALLOWED'
        userData.passwordLimitation = "NO LIMIT"

        const user = new User(userData)
        await user.save()
        res.json({
            result: 'OK'
        })
    })

    app.post('/login', urlencodedParser, (req, res) => {
        let userData = JSON.parse(req.headers.body);

        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);

        let isExists = users.some(user => user.name == userData.username && user.password == userData.password)

        if (isExists)
            res.json({
                result: 'OK'
            })
        else
            res.json({
                result: 'No such user'
            })
    })

    app.get('/users', (req, res) => {
        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);
        res.json(users)
    })

    app.post('/change-password', (req, res) => {
        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);
        let userFound = false;
        let userData = JSON.parse(req.headers.body);


        users.map(user => {
            if (user.name == userData.userName && user.password == userData.password) {
                user.password = userData.newPassword;
                userFound = true;
            }
        })

        fs.writeFileSync(path.resolve(__dirname, "../users.json"), JSON.stringify(users))

        res.json({ result: userFound })
    })

    app.get('/new-user', (req, res) => {
        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);

        users.push({
            name: req.query.name,
            password: '',
            role: 'USER',
            banStatus: 'ALLOWED',
            passwordLimitation: "NO LIMIT"
        })

        fs.writeFileSync(path.resolve(__dirname, "../users.json"), JSON.stringify(users))

        res.json(users)
    })

    app.get('/ban-user', (req, res) => {
        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);

        users.map(user => {
            if (user.name === req.query.name && user.name !== "ADMIN" && user.banStatus == "ALLOWED")
                user.banStatus = 'BANNED'
            else if (user.name === req.query.name && user.name !== "ADMIN" && user.banStatus == "BANNED")
                user.banStatus = 'ALLOWED'

        })

        fs.writeFileSync(path.resolve(__dirname, "../users.json"), JSON.stringify(users))
        res.json(users)
    })

    app.get('/limit-users-password', (req, res) => {
        let rawdata = fs.readFileSync(path.resolve(__dirname, "../users.json"));
        let users = JSON.parse(rawdata);

        users.map(user => {
            if (user.name === req.query.name && user.name !== "ADMIN" && user.passwordLimitation == "NO LIMIT")
                user.passwordLimitation = 'LIMITED'
            else if (user.name === req.query.name && user.name !== "ADMIN" && user.passwordLimitation == "LIMITED")
                user.passwordLimitation = 'NO LIMIT'
        })

        fs.writeFileSync(path.resolve(__dirname, "../users.json"), JSON.stringify(users))
        res.json(users)
    })
}