// /api/view/번호 로 접속하면 id 보임
export default (req, res) => {
  res.statusCode = 200;
  res.json({ id: req.query.id });
};
