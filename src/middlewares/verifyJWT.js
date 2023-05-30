import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../configs/tokens.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    res.locals.user = {
      name: decoded.UserInfo.name,
      email: decoded.UserInfo.email,
      avatar: decoded.UserInfo.avatar,
      id: decoded.UserInfo.id,
    };
    next();
  });
};

export default verifyJWT;
