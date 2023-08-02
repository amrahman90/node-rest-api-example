import jwt from "jsonwebtoken";
const generateAccessToken = (userId: string) => {
    const privateKey = `${process.env.ACCESS_TOKEN_SECRET}`;
    const accessToken = jwt.sign({ userId }, privateKey, { expiresIn: '15m' });
    return accessToken;
};

export default generateAccessToken;
  