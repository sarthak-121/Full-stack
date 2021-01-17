const auth = async (res, req, next) => {
    console.log('working')
    next()
}

module.exports = auth