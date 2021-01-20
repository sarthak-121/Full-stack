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
    const users = await User.find({})
    const userArray = []
    users.forEach(user => {
        userArray.push(user.username)
    })

    return userArray
}

const User = mongoose.model('User', userSchema)

module.exports = User