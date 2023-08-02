import User from "../models/User";
import jwt from "jsonwebtoken";

const verifyRefreshToken = (refreshToken: any) => {
	const privateKey = `${process.env.REFRESH_TOKEN_SECRET}`;

	return new Promise(async(resolve, reject) => {
        const user = await User.findOne({where:{ refreshToken }})
          if (!user)
            return reject({ error: true, message: "Invalid refresh token" });
    
          jwt.verify(refreshToken, privateKey, (err: any, tokenDetails: any) => {
            if (err)
            {
              return reject({ error: true, message: "Invalid refresh token" });
            }
            resolve({
              tokenDetails,
              error: false,
              message: "Valid refresh token",
            });
          });
        
      });
};

export default verifyRefreshToken;