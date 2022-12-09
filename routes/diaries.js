const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Diary = require('../models/Diary')

//  @desc   Show add page
//  @router     GET / diaries/add
router.get('/add', ensureAuth, (req, res) =>{
    res.render('diaries/add')
})

//  @desc   Process add form
//  @router     Post / diaries
router.post('/', ensureAuth, async (req, res) =>{
    try {
        req.body.user = req.user.id
        await Diary.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        res.render('error/500')
        console.log(req.body)
    }
})


//  @desc   Show all diaries
//  @router     GET / diaries
router.get('/', ensureAuth, async (req, res) =>{
    try {
        const diaries = await Diary.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('diaries/index', {
            diaries,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})

//  @desc   Show edit page
//  @router     GET / diaries/edit:id
router.get('/edit/:id', ensureAuth, async(req, res) =>{
    const diary = await Diary.findOne({
        _id: req.params.id
    }).lean()

    if(!diary) {
        return res.render('error/404')
    }

    if(diary.user != req.user.id){
        res.redirect('/diaries')
    } else {
        res.render('diaries/edit', {
            diary,
        })
    }
})


module.exports = router