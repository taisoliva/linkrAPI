import process from "../repositories/follows.repository.js";

export async function follow(req, res) {
  const userId = res.locals.user.id;
  const friendId = req.body.id;
  if (userId == friendId)
    return res.status(400).send("You can't follow yourself");
  try {
    await process.follow(userId, friendId);

    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function unfollow(req, res) {
  const userId = res.locals.user.id;
  const friendId = req.body.id;
  if (userId == friendId)
    return res.status(400).send("You can't unfollow yourself");
  try {
    await process.unfollow(userId, friendId);

    return res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const getFollows = async (_, res) => {
  const userId = res.locals.user.id;
  try {
  } catch (err) {
    res.status(500).send(err.message);
  }
};
