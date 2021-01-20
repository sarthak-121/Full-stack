const auth = async (res, req, next) => {
    console.log('working')

    if(0) {
        res.status(401).send()
    }

    next()
}

module.exports = auth