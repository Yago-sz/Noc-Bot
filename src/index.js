const { connect } = require("./connect");
const { load } = require("./load");
const express = require("express");

async function start() {
  const socket = await connect();
  load(socket);

  // 🟢 Mantém a porta aberta pra hospedagem detectar
  const app = express();
  const port = process.env.PORT || 3000;

  app.get("/", (req, res) => res.send("Bot WhatsApp rodando!"));
  app.listen(port, () => console.log(`Servidor ativo na porta ${port}`));
}
start();