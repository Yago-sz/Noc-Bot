const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("baileys");
const path = require("path");
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const {question, onlyNumbers} = require("./utils");

console.log("CHAVE DA IA:", process.env.OPENROUTER_API_KEY);

exports.connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRInTerminal: false, // vamos mostrar QR manualmente
    version,
    logger: pino({ level: "error" }),
    auth: state,
    browser: ["chrome (linux)", "", ""],
    markOnlineOnConnect: true,
  });

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Se tiver QR code, gera no terminal
    if (qr) {
      console.log("Escaneie este QR code com seu WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("Reconectando...");
        this.connect(); // tenta reconectar
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