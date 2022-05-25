const jwt = require("jsonwebtoken");

const auth = async (res, req, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).send({ error: true, message: "Token not provided" });
  }

  const [authType, token] = authorization.split(" ");
  if (authType !== "Bearer") {
    return res.status(403).send({ error: true, message: "Token not provided" });
  }

  if (!token) {
    return res.status(403).send({ error: true, message: "Token not provided" });
  }

  jwt.verify(token, process.env.SECERET_TOKEN, (err, data) => {
    if (err) return res.status(403);

    req.body.userData = data;
    next();
    return;
  });
};

module.exports = auth;
