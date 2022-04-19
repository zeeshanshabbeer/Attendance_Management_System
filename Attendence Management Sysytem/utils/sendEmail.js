const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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")

const sendEmail =async (to, from, subject, text) => {
console.log(to,from,subject,text)
    const msg = {
        to,
        from,
        subject,
        html:text,
    }
    return await sgMail.send(msg)
    // function(err, info) {
    //     if (err) {
    //         console.log(err);
    //         return err;
    //     } else {
    //         console.log("email send")
    //         return console.log("email send")   
    //     }
    // })
}
module.exports = sendEmail;