import process from "../repositories/follow.repository.js";
export async function follow(req, res) {
  const userId = res.locals.user.id;
  const friendId = req.body.id;
  try {
    await process.follow(req.body.id);

    return res.send(ok);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function unfollow(req, res) {
  const userId = res.locals.user.id;
  const friendId = req.body.id;
  try {
    await process.unfollow(req.params.id);

    return res.send(ok);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
