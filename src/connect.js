const {
  default: makeWASocket,
  DisconnectReason,
  makeMongoDBAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
require("dotenv").config(); // garante acesso ao MONGO_URI
const { question, onlyNumbers } = require("./utils");

console.log("CHAVE DA IA:", process.env.OPENROUTER_API_KEY);

exports.connect = async () => {
  const { state, saveCreds } = await makeMongoDBAuthState({
    uri: process.env.MONGO_URI,
    collection: "auth_sessions", // pode mudar o nome se quiser
  });

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: "error" }),
    auth: state,
    browser: ["chrome (linux)", "", ""],
    markOnlineOnConnect: true,
  });

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Escaneie este QR code com seu WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("Reconectando...");
        this.connect();
      } else {
        console.log("Conexão encerrada (logout).");
      }
    } else if (connection === "open") {
      console.log("Conectado ao WhatsApp!");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
};