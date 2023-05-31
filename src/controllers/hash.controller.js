import hash from "../repositories/hash.repository.js";
export async function getHashRank(req, res) {
  console.log(`<<<<<`);
  try {
    const hashRank = hash.getHashRank();
    if (!hashRank) return res.status(404).send("Hash not found");
    res.send(hashRank);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getHashDetail(req, res) {
  const { hash } = req.params;
  try {
    const hashDetail = hash.getHashDetail(hash);
    if (!hashDetail) return res.status(404).send("Hash not found");
    res.send(hashDetail);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
