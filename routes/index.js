const express = require('express')
const router = express.Router()

//  @desc   Login/Landing page
//  @router     GET /
router.get('/', (req, res) =>{
    res.send('Login')
})


module.exports = router