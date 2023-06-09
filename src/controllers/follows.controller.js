import process from "../repositories/follows.repository.js";

export async function following(req, res) {
  const user = res.locals.user.id;
  const friend = req.params.id;
  if (user == friend) return res.status(200).send({ ownUser: true, following: false });
  try {
    const result = await process.following(user, friend);
    if (!result.length) return res.status(204).send({ ownUser: false, following: false });

    return res.status(200).send({ ownUser: false, following: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

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
    const response = await process.getFollowers(userId)
    return res.status(200).json(response)
  } catch (err) {
    res.status(500).send(err.message);
  }
};
