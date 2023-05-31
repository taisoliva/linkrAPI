export async function getHashRank(req, res) {
  try {
    res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getHashDetail(req, res) {
  try {
    res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
