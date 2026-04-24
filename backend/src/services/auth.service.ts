import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { UserModel } from "../models/User";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existingUser = await UserModel.findOne({ email: input.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash
  });

  return buildAuthPayload(user.id, user.name, user.email);
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return buildAuthPayload(user.id, user.name, user.email);
}

function buildAuthPayload(userId: string, name: string, email: string) {
  const token = jwt.sign({ email }, env.jwtSecret as Secret, {
    subject: userId,
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
  });

  return {
    token,
    user: {
      id: userId,
      name,
      email
    }
  };
}
