// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // or true if using SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendUserCredentials(email: string, password: string) {
    const mailOptions = { 
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome! Your Account Details',
      text: `Your account has been created. Your password is: ${password}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle the error appropriately (e.g., log it, throw an exception)
    }
  }
async sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:3001/reset-password/${token}`; // frontend URL
  await this.transporter.sendMail({
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}

  
}


