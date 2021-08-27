const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = (email, name, token, host, id) => {
    sgMail.send({
        to: email, 
        from: 'ahmed.abdalllah22@gmail.com', 
        subject: 'Verification Mail',
        html: `<h1>Hello ${name}</h1>
                <p>Thank you for regiestering on our website</p>
                <p>Please click on the link below to verify your account</p>
                <a href="http//:${host}/users/verify-email?token=${token}&id=${id}"> Verify Your Account</a>`,
    })
    
    
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'ahmed.abdalllah22@gmail.com', 
        subject: 'GoodBye Mail',
        html: `<strong> 
                Dear ${name}, 
                Goob Bye.  
                Best regards
                </strong>`,
    })
    
}




module.exports = {
    sendVerificationEmail,
    sendCancelEmail
}
