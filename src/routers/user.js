const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    await User.init()
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {

    try {
        const user = await User.findByCridentials(req.body.email, req.body.password)
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/people', auth, async (req, res) => {
    try {
        const users = await User.getUsers()
        res.send(users)
    } catch(e) {
        res.send(500).send(e)
    }
})

router.post('/request', auth, async (req, res) => {
    try {
        await User.setRequest(req.body.username, req.body.request)
        res.status(200).send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/getRequest', auth, async (req, res) => {
    try {
        const request = await User.getRequests(req.body.username)
        res.send(request)
    } catch(e) {
        res.status(500).send(e)
    }
})


// test router
router.get('/getmedata', (req, res) => {
    res.send({
        working: "ok",
        status: "good luck"
    })
})

module.exports = router