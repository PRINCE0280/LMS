import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail app password (not regular password)
    }
});

export const sendOTPEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: `"E-Learning" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP for E-Learning Platform Verification',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .otp-box {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            margin: 10px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 12px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <div class="header">
                                <h1 style="color: #667eea; margin: 0;">E-Learning Platform</h1>
                            </div>
                            <h2>Hello ${name || 'User'}!</h2>
                            <p>Thank you for signing up. To complete your verification, please use the OTP below:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px;">Your OTP Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 0; font-size: 12px;">Valid for 10 minutes</p>
                            </div>
                            
                            <p><strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone.</p>
                            
                            <p>If you didn't request this OTP, please ignore this email.</p>
                            
                            <div class="footer">
                                <p>&copy; 2025 E-Learning Platform. All rights reserved.</p>
                                <p>This is an automated email. Please do not reply.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
