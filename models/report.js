const mongoose = require('mongoose')
const validator = require('validator')


const reportSchema = new mongoose.Schema({
    status:{
        type:String,
        enum: ['up', 'down'],
        required:true,
    },
    availability:{
        type:Number,
    },
    outages:{
        type:Number,
    },
    downtime:{
        type:Number,
    },
    uptime:{
        type:Number,
    },
    checkHistory:[{
        history:{
            type: String,
            enum: ['up', 'down'],
            timestamps: true
        }  
    }],
    check_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Check'
    }
}, {
    timestamps:true,
})


const Report = mongoose.model('Report', reportSchema)

module.exports = Report
