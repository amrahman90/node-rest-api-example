import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import generateAccessToken from '../utils/generateAccessToken';
import verifyRefreshToken from '../utils/verifyToken';

//Registration API endpoint
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, isActive } = req.body;
    //generate Salt using bcrypt package
    const salt = await bcrypt.genSalt(10);
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user instance
    const user = new User();
    user.email = email;
    user.isActive = isActive;
    user.password = hashedPassword;
    await user.save();
    //Response is send when user send request
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

//getAllUserData API endpoint 
export const getAlluser = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    // Send a success response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Delete User API endpoint
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    //Searching User from the schema using id parameter
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete the user from the database
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error during user deletion:', error);
    res.status(500).json({ message: 'User deletion failed' });
  }
};

//Login API endpoint
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      // Compare the password with the bcrypt-hashed password
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (passwordMatch) {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        // Create new instance
        await user.save();
        // Send a success response
        res.status(200).json({ message: 'Password reset successful' });
      } else {
        res.status(401).json({ message: 'Invalid old password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};
//Logout API endpoint
export const logout = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.body;

  try {
    //Accessing user accroding to the refreshToken and AccessToken
    const user = await User.findOne({ where: { accessToken, refreshToken } });
    if (user) {
      //Resetting token 
      user.accessToken = null;
      user.refreshToken = null;
      user.isActive = false
      //Create new instance
      await user.save();
      //Send the success Response
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(401).json({ message: 'Invalid access token or refresh token' });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

//RefreshToken API endpoint
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    // Verify the refresh token
    const verificationResult: any = await verifyRefreshToken(refreshToken);

    // Access the token details if the verification was successful
    if (!verificationResult.error) {
      const { tokenDetails } = verificationResult;
      const { id, refreshToken } = tokenDetails;

      // Find the user by the user ID
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        //Generating new AccessToken
        user.accessToken = generateAccessToken(id);
        user.refreshToken = refreshToken;
        //Create new instance
        await user.save();
        //Send Success Response 
        res.status(200).json({ message: 'New access token generated successfully' });
      } else {
        res.status(401).json({ message: 'Invalid user ID' });
      }
    } else {
      res.status(401).json({ message: verificationResult.message });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};




