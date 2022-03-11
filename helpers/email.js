import nodemailer from 'nodemailer'

export const registerEmail=async(data) => {
   const {email, name, token}=data

    const transport = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    //email data
    const info=await transport.sendMail({
        from:'"UpTask - Projects Manager" <cuentas@uptask.com>',
        to:email,
        subject:"UpTask - Confirm your account",
        text:"Confirm your account in UpTask",
        html:`
            <p style="font-weight:bold">Hello:${name} Confirm your account in UpTask</p>
            <p>Your account is almost ready, You just must confirm it clicking the next link:
              <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>  
            </p>
            <p>If you did not create this account, you can ignore the message</p>
        `,
    })
}

export const recoverPasswordEmail=async(data) => {
    const {email, name, token}=data
    //TODO: Move into environment variables
    const transport = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
     //email data
     const info=await transport.sendMail({
         from:'"UpTask - Projects Manager" <cuentas@uptask.com>',
         to:email,
         subject:"UpTask - Restore your password",
         text:"Restore your password in UpTask",
         html:`
             <p style="font-weight:bold">Hello:${name} you have asked for a new password in UpTask</p>
             <p>Click the next link to recover your password:
               <a href="${process.env.FRONTEND_URL}/recover-password/${token}">Restore password</a>  
             </p>
             <p>If you did not ask for a new password, you can ignore the message</p>
         `,
     })
 }