const nodemailer = require('nodemailer')

async function sendEmail(data) {
    //logic to send email

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailAppPassword
        }
    })

    await transporter.sendMail({
        from: `NepBlogs<${process.env.email}>`,
        to: data.email,
        subject: data.subject,
        text: data.text

    })


}


module.exports = sendEmail