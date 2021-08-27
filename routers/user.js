const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendVerificationEmail,sendCancelEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendVerificationEmail(user.email, user.name, token,req.headers.host, user._id)
        res.status(201).send({
            user,
            token
        })    
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/users/verify-email',  async (req, res) => {
    try {
        const user = await User.findOne({_id: req.query.id })
        const user_token = user.tokens[0].token
        if( req.query.token !== user_token ){
            res.send('token is invalid')
        } else {
            user.isVerified = true
            user.tokens = []
            await user.save()
            res.send('user verify his account')
        }
    } catch (error) {
        res.status(400).send()
    }
    
    
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        if (user.isVerified === false){
            res.send('verify your account first')
        }else{
            res.send({
                user,
                token
            })
        }
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })
        await req.user.save()
        res.send('Logout!!')
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logout!!')
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValid = updates.every( (update) => allowedUpdates.includes(update) )
    if(!isValid){
        return res.status(400).send({error: 'invaild updates'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send({
            message:"User Updated",
            user: req.user
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req,res) => { 
    try {
        
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send({
            message: "User Deleted!",
            user:req.user,
        }) 
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router