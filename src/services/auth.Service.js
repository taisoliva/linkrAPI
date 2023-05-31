import bcrypt from "bcrypt";
import * as authRepository from "../repositories/auth.Repository.js";
import pkg from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../configs/tokens.js";
const { sign, verify } = pkg;

export const refreshTokenExpiresIn = 24 * 60 * 60 * 1000; // one day
export const accessTokenExpiresIn = 10 * 10000; // 10 seconds

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateTokens = (user) => {
  const accessToken = sign(
    {
      UserInfo: {
        name: user.name,
        email: user.email,
        avatar: user.picture,
        id: user.id,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenExpiresIn }
  );
  const refreshToken = sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenExpiresIn,
  });
  return { accessToken, refreshToken };
};

export const saveRefreshToken = async (id, refreshToken) => {
  return authRepository.saveRefreshToken(id, refreshToken);
};

const generateAccessToken = (userInfo) => {
  return sign({ UserInfo: userInfo }, ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
};

export const verifyRefreshToken = async (refreshToken) => {
  const foundUser = await authRepository.findUserByRefreshToken(refreshToken);
  if (!foundUser) {
    return false;
  }
  try {
    const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (foundUser.user_id !== decoded.id) {
      return false;
    }
    const accessToken = generateAccessToken({
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar,
      id: foundUser.user_id,
    });
    return { foundUser, accessToken };
  } catch (error) {
    return false;
  }
};

export const deleteRefreshToken = async (refreshToken) => {
  const foundUser = await authRepository.findUserByRefreshToken(refreshToken);
  if (!foundUser) {
    return false;
  }
  const result = await authRepository.deleteRefreshToken(foundUser.id);
  return result;
};

export const findUserByEmail = async (email) => {
  return authRepository.findUserByEmail(email);
};

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const result = await authRepository.createUser({
    ...userData,
    password: hashedPassword,
  });
  return result;
};
