const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        await User.init()
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

router.get('/people', auth, async (req, res) => {
    try {
        const users = await User.getUsers()
        res.send(users)
    } catch(e) {
        res.send(500).send(e)
    }
})

router.post('/setRequest', auth, async (req, res) => {
    try {
        await User.setRequest(req.body.sender, req.body.reciever)
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

router.post('/acceptedReq', auth, async (req, res) => {
    try {
        const room = await User.acceptedRequest(req.body.user, req.body.username)
        res.status(200).send({room})
    } catch(e) {
        res.status(500).send()
    }
})


// test router
router.get('/getmedata/:data', async (req, res) => {
    try {
        await User.justATest(req.params.data)
        res.send({
            data: req.params.data,
            working: "ok",
            status: "good luck"
        })
    } catch(e) {
        res.status(500).send(e.message)
    }
 
})

module.exports = router