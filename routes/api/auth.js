const express = require('express')
const router = express.Router()

//@route    GET api/auth
//@descrip  Test route
//@access    Public
router.get('/', (req, res) => {
  res.send('auth route')
})

module.exports = router
