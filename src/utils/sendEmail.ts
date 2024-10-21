import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.YOUR_EMAIL,
        pass: process.env.YOUR_EMAIL_APP_PASSWORD
    }
})

interface EmailProps {
    email: string,
    otp: string
}


const sendEmail = async ({email, otp}: EmailProps ) => {

try {
 await transporter.sendMail({
    from: process.env.YOUR_EMAIL,
    to: email,
    subject: 'Verify Your Registration',
    text: `Your OTP code for verification is ${otp}. Please enter this code to confirm your registration.`,
    html: `
        <h1>Verify Your Registration</h1>
        <p>Thank you for registering with us!</p>
        <p>Your OTP code for verification is <strong>${otp}</strong>.</p>
        <p>Please enter this code to confirm your registration.</p>
        <p>If you did not request this, please ignore this email.</p>
    `,

}) 


} catch (error) {
    console.error('Error during sending email OTP:', error);
    return NextResponse.json({
        success: false,
        message: 'Failed to send an OTP to your email',
    });
}

}

export default sendEmail