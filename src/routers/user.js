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

router.post('/app', auth, async (req, res) => {
    
    res.send()
})

module.exports = router