const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/full-stack-database',  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//   /Users/setuk/mongodb/bin/mongod.exe --dbpath=/Users/setuk/mongodb-data