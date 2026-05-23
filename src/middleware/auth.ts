import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!",
        });
      }

      // decode token
      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      // check user exist or not by id
      const userData = await pool.query(
        `
          SELECT * FROM users
          WHERE id = $1
          `,
        [decoded.id],
      );

      const user = userData.rows[0];

      if (!user) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found!",
        });
      }

      // check user role
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
