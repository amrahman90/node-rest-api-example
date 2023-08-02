import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token,`${process.env.REFRESH_TOKEN_SECRET}`, (error: any, decoded: any) => {
        if (error) {
              return res.sendStatus(403);
          }
          req.user = decoded;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};
