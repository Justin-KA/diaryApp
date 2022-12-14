const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

const Diary = require('../models/Diary')

//  @desc   Login/Landing page
//  @router     GET /
router.get('/', ensureGuest, (req, res) =>{
    res.render('login', {
        layout: 'login',
    })
})

//  @desc   Dashboard
//  @router     GET /
router.get('/dashboard', ensureAuth, async (req, res) =>{
    try {
        const diaries = await Diary.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            diaries
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }


})


module.exports = router