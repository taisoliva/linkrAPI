import bcrypt from "bcrypt";
import * as authRepository from "../repositories/authRepository.js";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const refreshTokenExpiresIn = 24 * 60 * 60 * 1000; // one day
export const accessTokenExpiresIn = 10 * 1000; // 10 seconds

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateTokens = (user) => {
  const accessToken = sign(
    {
      UserInfo: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenExpiresIn }
  );
  const refreshToken = sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenExpiresIn,
  });
  return { accessToken, refreshToken };
};

export const saveRefreshToken = async (id, refreshToken) => {
  return authRepository.saveRefreshToken(id, refreshToken);
};

const generateAccessToken = (userInfo) => {
  return sign({ UserInfo: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
};

export const verifyRefreshToken = async (refreshToken) => {
  const foundUser = await authRepository.findUserByRefreshToken(refreshToken);
  if (!foundUser) {
    return false;
  }
  try {
    const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (foundUser.id !== decoded.id) {
      return false;
    }
    const accessToken = generateAccessToken({
      name: foundUser.name,
      email: foundUser.email,
      id: foundUser.id,
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
  const { name, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
  return result;
};
