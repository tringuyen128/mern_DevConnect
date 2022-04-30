const jwt = require('jsonwebtoken')
//we need secret key
const config = require('config')

module.exports = function (req, res, next) {
  // Get token from the header because when we send the request to protected route we need to send a token with the header
  const token = req.header('x-auth-token')

  //Check if not token, send 401 for not authorized
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization dinied' })
  }
  //Verify token if there is one
  try {
    //this will decoded the token id there is token
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user
    next()
    //if no token- send back the message token is not valid
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
