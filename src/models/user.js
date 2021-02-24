const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    sended: {
        type: [String],
        'default': "_sended"
    },
    recieved: {
        type: [String],
        'default': "_recieved"
    }
})

userSchema.statics.findByCridentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    if(user.password === password) {
       return user
    } else {
        console.log("working")
        throw new Error('Unable to login')
    }
}

userSchema.statics.getUsers = async () => {
    const users = await User.find({}, {username: 1, _id: 0})
    const userArray = []
    users.forEach(user => {
        userArray.push(user.username)
    })

    return userArray
}

userSchema.statics.setRequest = async (sender, reciever) => {
    try {
        await User.updateOne({username: sender}, {$push: {sended: reciever}})
        await User.updateOne({username: reciever}, {$push: {recieved: sender}})
    } catch(e) {
        throw new Error("Unable to send request")
    }
}

userSchema.statics.getRequests = async (username) => {
    try {
       const data = await User.findOne({username}, {sended: 1, recieved: 1, _id: 0})
       return data
    } catch(e) {
        throw new Error("unable to fetch requests")
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User