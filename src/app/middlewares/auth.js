const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  // middleware intercepta a informacao(usuario)
  // next - apenas se o usuario puder ir para o proximo passso
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  // bearer u12h3i1u2h3iu1h2 - formato, verificar agora
  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts; // desestruturacao para pegar as duas partes do token

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });

    req.userId = decoded.id;
    return next();
  });
};
