import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  // make hash password
  const hashPassword = await bcrypt.hash(password, 11);

  const result = await pool.query(
    `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
        `,
    [name, email, hashPassword, role],
  );

  // delete password from returing result
  delete result.rows[0].password;

  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // check user is exists
  const userData = await pool.query(
    `
        SELECT * FROM users
        WHERE email = $1
        `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Cridentials!");
  }

  // check password
  const matchPassword = await bcrypt.compare(
    password,
    userData.rows[0].password,
  );

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  delete userData.rows[0].password;
  const user = userData.rows[0];

  // generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { token, user };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
