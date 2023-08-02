import {  Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CookieSerializeOptions, serialize } from 'cookie';
import Token from '../models/Token';
import nodemailer from 'nodemailer';

//Login API endpoint
export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (user) {
         // Compare the password with the bcrypt-hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Generate access token
          const accessToken = jwt.sign({ id: user.id, email: user.email }, `${process.env.REFRESH_TOKEN_SECRET}`, {
            expiresIn: '14m',
          });
           // Generate refresh token
          const refreshToken = jwt.sign({ id: user.id, email: user.email },`${process.env.REFRESH_TOKEN_SECRET}`, {
            expiresIn: '30d',
          });
           // Save the tokens to the user in the database
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.isActive = true
          await user.save();
  
          // Configure options for the cookies
          const cookieOptions: CookieSerializeOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict', // Adjust this based on your requirements
            // Add more options if needed
          };
  
          // Serialize the cookies
          const accessTokenCookie = serialize('accessToken', accessToken, cookieOptions);
          const refreshTokenCookie = serialize('refreshToken', refreshToken, cookieOptions);
  
          // Set the cookies in the response headers
          res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
  
          res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
        } else {
          res.status(401).json({ message: 'Invalid email or password' });
        }
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  };

// Function to generate the user's access token
const generateToken = async (user: User): Promise<string> => {
    const token = jwt.sign({ userId: user.id },`${process.env.JWT_SECRET}`, {
        expiresIn: '15m',
    });

    const expiredTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const tokenData = {
        userId: user.id,
        token: token,
        expiredTime: expiredTime,
    };

    await Token.create(tokenData as Token);

    return token;
};

// Function to update the user's access token
const updateAccessToken = async (email: string, accessToken: string): Promise<void> => {
    await User.update({ accessToken }, { where: { email } });
};

//Reset Password Link API endpoint
export const resetPasswordLink = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email } = req.body;
        // Check if the user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Generate a random token
        const token = await generateToken(user);

        await updateAccessToken(email, token);

        // Send the reset password email
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Password Reset',
            text: 'Please click the following link to reset your password:',
            html: `<a href="${process.env.RESET_PASSWORD_URL}?token=${token}">Reset Password</a>`,
        };

        await transporter.sendMail(mailOptions);

        // await sendEmail(email, "password-change", `<a href="${process.env.RESET_PASSWORD_URL}?token=${token}">Reset Password</a>`)

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to update the user's password
const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    await User.update({ password: hashedPassword }, { where: { id: userId } });
};

// Forgot password API endpoint
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        // Check if the token exists
        const existingToken = await Token.findOne({ where: { token } });

        if (!existingToken) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }

        if (existingToken.expiredTime < new Date()) {
            res.status(400).json({ message: 'Token expired' });
            return;
        }

        // Verify and decode the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Update the user's password
        await updatePassword(decodedToken.userId, newPassword);

        // Delete the used token
        await Token.destroy({ where: { token } });

        // Send a success response
        res.json({ message: 'Password change successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAlltoken = async (req: Request, res: Response) => {
    try {
      const users = await Token.findAll();
       // Send a success response
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  