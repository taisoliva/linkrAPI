import hash from "../repositories/hashtags.repository.js";
export async function getHashRank(req, res) {
  try {
    const hashRank = await hash.getHashRank();
    if (!hashRank) return res.status(404).send("Trending not found");

    return res.send(hashRank);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getHashDetail(req, res) {
  try {
    const hashDetail = await hash.getHashDetail(req.params.hash);
    if (!hashDetail) return res.status(404).send("Hash not found");
    return res.send(hashDetail);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
