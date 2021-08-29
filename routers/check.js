const express = require('express')
const Check = require('../models/check')
const Report = require('../models/report')
const History = require('../models/history')
const auth = require('../middleware/auth')
const axios = require('axios');
const { sendNotificationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/checks', auth ,async (req, res) => {
    
    const check = new Check({
        ...req.body,
        owner: req.user._id
    })
    try {
        await check.save()
        await Report.create({
            status: 'up',
            availability: 100,
            outages: 0,
            downtime: 0,
            uptime: 60,
            checkHistory: {history:'up'},
            check_id: check._id,
        });
        res.status(201).send(check)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/checks/:id', auth,async (req,res) => {
    const _id = req.params.id
    
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'name',
        'url', 
        'protocol',
        'path', 
        'port', 
        'webhook', 
        'timeout', 
        'interval', 
        'threshold', 
        'authentication', 
        'httpHeaders', 
        'assert', 
        'tags', 
        'ignoreSSL']
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        res.status(400).send({error: 'Invalid Update'})
    }

    try {
        const check = await Check.findOne({_id:req.params.id, owner: req.user._id})
        if(!check){
            res.status(404).send()
        }
        updates.forEach((update) => check[update] = req.body[update])
        await check.save()
        res.send({
            check,
        })    
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/checks/:id', auth , async (req,res) => {
    const _id = req.params.id 
    try {
        const check = await Check.findOneAndDelete({_id: req.params.id , owner:req.user._id})
        if(!check){
            res.status(404).send()
        }
        res.send('Check Deleted') 
    } catch (error) {
        res.status(500).send(error)
    }

})

router.post('/checks/run',auth, async (req,res) => {
    const checkId = req.body;
    const checkResult = await Check.findOne(checkId)
    const reportResult = await Report.findOne({check_id:checkId})
    const tempURL = `${checkResult.protocol}://${checkResult.url}`
    setInterval(async () => {
        const result = await axios.get(tempURL)
        .catch( async (e) => {
            if (reportResult.status === 'up') {
                sendNotificationEmail(req.user.email, req.user.name, 'Your check become down',tempURL )
                // console.log('Your check become down')
            }
            const downTimeTemp = await reportResult.downtime + (checkResult.interval * 60);
            await Report.updateOne({
                check_id:checkId, 
            },{
                status: 'down',
                availability: ((reportResult.uptime) / (downTimeTemp + reportResult.uptime)) * 100,
                outages: reportResult.outages + 1,
                downtime: downTimeTemp,
                uptime: reportResult.uptime,
            })
            await History.create({
                status: 'down',
                check_id: checkId,
            })
            
            res.status(500).send('site is down ')
        })
        

        if (result.status >= 200 && result.status < 300) {
            if (reportResult.status === 'down') {
                sendNotificationEmail(req.user.email, req.user.name, 'Your check become up',tempURL  )
                // console.log('Your check become up')
            }
            const upTimeTemp = reportResult.uptime + (checkResult.interval * 60);
            await Report.updateOne({
                check_id:checkId, 
            },{
                status: 'up',
                availability: ((upTimeTemp) / (reportResult.downtime + upTimeTemp)) * 100,
                outages: reportResult.outages,
                downtime: reportResult.downtime,
                uptime: upTimeTemp,
            })
            await History.create({
                status: 'up',
                check_id: checkId,
            })
            res.status(200).send('site is up')
        } 
    },1000) //checkResult.interval*60*1000
})

router.get('/checks/report',auth, async (req,res) => {
    try {
        const report = await Report.findOne({check_id: req.body._id,})
        const history = await History.find({check_id: req.body._id,})
        if (!report) {
            res.status(404).send('report not found');
        } else {
            res.status(200).send({
                report,
                history
            })
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
    
})

router.get('/checks/tag', auth,async (req, res) => {
    const searchField = req.query.name;
    const checkName = await Check.find({name: {$regex: searchField, $options: '$i'}})
    let checkID = checkName.map(a => a._id)
    const report = []
    for (let i = 0; i < checkID.length; i++) {
        const item = await Report.find({check_id: checkID[i].toString()})
        report.push(item[0])
    }
    //console.log(report)
    if(!report){
        res.status(500)
    }
    res.send(report);
});



module.exports = router

