const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route    GET api/profile/me
//@descrip  Get current users profile
//@access    Private
router.get('/me', auth, async (req, res) => {
  try {
    //find a user and populate the user profile with avatar
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )
    //check if no profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Sever Error')
  }

  //@route    POST api/profile
  //@descrip  Create || Update  users profile
  //@access   Private
  router.post(
    // we using auth and validation middleware
    '/',
    [
      auth,
      check('status', 'Status is required').not().isEmpty(),
      check('skill', 'Skill is required').not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
    }
  )

  //these are fields
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    Linkedin,
  } = req.body

  //build profile object
  const profileFields = {}

  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim())
  }

  console.log(skills)
  res.send('hello')
})

module.exports = router
