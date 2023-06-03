import {
  findUserByEmail,
  createUser,
  comparePassword,
  generateTokens,
  saveRefreshToken,
  refreshTokenExpiresIn,
  deleteRefreshToken,
  verifyRefreshToken,
} from "../services/auth.Service.js";

export const postUser = async (req, res) => {
  try {
    const foundUser = await findUserByEmail(req.body.email.toLowerCase());
    if (foundUser) {
      return res
        .status(409)
        .json({ message: "User already registered with this Email" });
    }
    await createUser(req.body);
    res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const handleLogin = async (req, res) => {
  try {
    const foundUser = await findUserByEmail(req.body.email.toLowerCase());
    if (!foundUser) {
      return res.sendStatus(401); //unauthorized
    }
    const match = await comparePassword(req.body.password, foundUser.password);
    if (match) {
      const { accessToken, refreshToken } = generateTokens(foundUser);
      await saveRefreshToken(foundUser.id, refreshToken);
      if (req?.cookies?.jwt) {
        res.clearCookie("jwt", { httpOnly: true });
      }

      const response = {
        id: foundUser.id,
        name: foundUser.name,
        avatar: foundUser.picture,
        accessToken,
      };

      if (req.body.cookiesAccepted) {
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: refreshTokenExpiresIn,
        });
        return res.json(response);
      }
      return res.json({ ...response, refreshToken });
    } else {
      return res.sendStatus(401); //unauthorized
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // no content
  }
  const refreshToken = cookies.jwt;
  const deleted = await deleteRefreshToken(refreshToken);

  if (!deleted) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(403); // Forbidden
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const result = await verifyRefreshToken(refreshToken);

  if (!result)
    return res.status(403).json({ message: "refreshToken not found" });
  const { foundUser, accessToken } = result;

  res.json({
    id: foundUser.user_id,
    name: foundUser.name,
    avatar: foundUser.avatar,
    accessToken,
  });
};

export const handleRefreshTokenWithoutJWT = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  const result = await verifyRefreshToken(token);

  if (!result)
    return res.status(403).json({ message: "refreshToken not found" });
  const { foundUser, accessToken } = result;

  res.json({
    id: foundUser.user_id,
    name: foundUser.name,
    avatar: foundUser.avatar,
    accessToken,
  });
};

export const postCheckCookies = async (req, res) => {
  const { testCookie } = req.body;
  res
    .cookie("testCookie", testCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: refreshTokenExpiresIn,
    })
    .send();
};

export const getCheckCookies = async (req, res) => {
  const cookiesAccepted = req.cookies.testCookie ? true : false;
  console.log(`Sending cookiesAccepted: ${cookiesAccepted}`);
  res.json({ cookiesAccepted });
};