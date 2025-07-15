const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const { question, onlyNumbers } = require("./utils");

console.log("CHAVE DA IA:", process.env.OPENROUTER_API_KEY);

exports.connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: false,
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
        exports.connect(); // importante: use `exports.connect` em vez de `this.connect`
      } else {
        console.log("Conexão encerrada (logout).");
      }
    } else if (connection === "open") {
      console.log("✅ Conectado ao WhatsApp!");
    }
  });

  socket.ev.on("creds.update", async (creds) => {
    console.log("💾 Salvando credenciais localmente...");
    await saveCreds(creds);
  });

  return socket;
};