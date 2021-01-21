const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const crypto = require("crypto");

var sendgrid = require("sendgrid")(
  "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"
);

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400 // expirar o token em 1 dia
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(408).send({ erro: "usuario ja existe" });

    const user = await User.create(req.body);

    return res.send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: "registro falhou" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send({ error: "usuario nao encontrado" });

  res.send({
    user,
    token: generateToken({ id: user.id })
  });
});

router.post("/forgot_email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "usuario nao encontrado" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1); // pega a hora e faz com que o token expire 1h depois

    await User.findByIdAndUpdate(user.id, {
      $set: {
        emailResetToken: token,
        emailResetExpires: now
      }
    });

    sendgrid.send(
      {
        to: email,
        from: "noreply@botmail",
        subject: "noreply solicitacao de alteracao de email",
        html: `Voce esqueceu seu email? nao tem problema, utilize esse token: ${token} para poder mudar seu email`
      },
      err => {
        if (err)
          return res
            .status(400)
            .send({ error: "nao foi possivel enviar o email" });

        return res.send();
      }
    );
  } catch (err) {
    res
      .status(400)
      .send({ error: "erro ao tentar recuperar o email, tente novamente" });
  }
});

router.post("/reset_email", async (req, res) => {
  const { email, token, new_email } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+emailResetToken emailResetExpires"
    );

    if (!user) return res.status(400).send({ error: "email nao encontrado" });

    if (token !== user.emailResetToken)
      return res.status(400).send({ error: "token invalido" });

    const now = new Date();

    if (now > user.emailResetExpires)
      return res
        .status(400)
        .send({ error: "token expirou, gere um novo toke" });

    user.email = new_email;

    await user.save();

    res.send();
  } catch (err) {
    res
      .status(400)
      .send({ error: "erro ao tentar recuperar o email, tente novamente" });
  }
});

module.exports = app => app.use("/auth", router);
