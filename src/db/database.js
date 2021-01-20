const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL ,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//   /Users/setuk/mongodb/bin/mongod.exe --dbpath=/Users/setuk/mongodb-data