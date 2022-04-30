const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

//@route    POST api/users
//@descrip  Register user
//@access    Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if the user exists
    try {
      let user = await User.findOne({ email: email })

      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists' }] })
      }

      //Get users gravatar (s: size, r: rate, d: default)
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      // this is only user instance not save in database, password also not encrypted
      user = new User({
        name,
        email,
        avatar,
        password,
      })

      //Encrypt password and save into the database
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()

      //json webtoken
      const payload = {
        user: {
          id: user.id,
        },
      }
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(400).send('Server error')
    }
  }
)

module.exports = router
