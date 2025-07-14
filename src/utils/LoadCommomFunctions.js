const { extractDataFromMessage, baileysIs } = require(".");
const { BOT_EMOJI, TEMP_DIR } = require("../config");
const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { waitMessage } = require("../utils/message");
const sticker = require("../commands/member/sticker");

exports.LoadCommomFunctions = ({ socket, webMessage }) => {
    const { remoteJid, prefix, commandName, args, userJid, isReply, replyJid } =
        extractDataFromMessage(webMessage);

    const quoted = webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const isImage = baileysIs(webMessage, "image") || baileysIs({ message: quoted }, "image");
    const isVideo = baileysIs(webMessage, "video") || baileysIs({ message: quoted }, "video");
    const isSticker = baileysIs(webMessage, "sticker") || baileysIs({ message: quoted }, "sticker");

    // 🧩 Função download universal (image, video, sticker)
    const download = async (webMessage, filename, type, ext) => {
        const content = webMessage.message?.[`${type}Message`] ||
            webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[`${type}Message`];

        if (!content?.mediaKey) {
            throw new Error("❌ Mídia inválida ou mediaKey ausente.");
        }

        const stream = await downloadContentFromMessage(content, type);
        const filePath = path.resolve(TEMP_DIR, `${filename}.${ext}`);
        const buffer = [];

        for await (const chunk of stream) {
            buffer.push(chunk);
        }

        fs.writeFileSync(filePath, Buffer.concat(buffer));
        return filePath;
    };

    const downloadImage = async (webMessage, filename) => {
        return await download(webMessage, filename, "image", "png");
    };

    const downloadSticker = async (webMessage, filename) => {
        return await download(webMessage, filename, "sticker", "webp");
    };

    const downloadVideo = async (webMessage, filename) => {
        return await download(webMessage, filename, "video", "mp4");
    };

    const sendText = async (text) => {
        return await socket.sendMessage(remoteJid, { text: `${BOT_EMOJI} ${text}` });
    };

    const sendReply = async (text) => {
        return await socket.sendMessage(remoteJid, { text: `${BOT_EMOJI} ${text}` }, { quoted: webMessage });
    };

    const sendReact = async (emoji) => {
        return await socket.sendMessage(remoteJid, {
            react: {
                text: emoji,
                key: webMessage.key,
            },
        });
    };

    const sendSucessReact = async () => await sendReact("🍅");
    const sendWaitReact = async () => await sendReact("⌛");
    const sendWarningReact = async () => await sendReact("⚠️");
    const sendErrorReact = async () => await sendReact("❌");

    const sendSuccessReply = async (text) => {
        await sendSucessReact();
        return await sendReply(`Noc Bot: ${text}`);
    };

    const sendWaitReply = async (text) => {
        await sendWaitReact();
        return await sendReply(`⌛ Espere!`);
    };

    const sendWarninReply = async (text) => {
        await sendWarningReact();
        return await sendReply(`⚠️ Atenção! ${text}`);
    };

    const sendErrorReply = async (text) => {
        await sendErrorReact();
        return await sendReply(`❌ Deu erro! ${text}`);
    };

    const sendStickerFromFile = async (file) => {
        return await socket.sendMessage(remoteJid, {
            sticker: fs.readFileSync(file),
        });
    };

    const sendImageFromFile = async (file) => {
        return await socket.sendMessage(remoteJid, {
            image: fs.readFileSync(file), // <- corrigido "Image" para "image"
        });
    };

    return {
        socket,
        remoteJid,
        userJid,
        prefix,
        commandName,
        args,
        isReply,
        isImage,
        isVideo,
        isSticker,
        replyJid,
        webMessage,
        sendText,
        sendReply,
        sendStickerFromFile,
        sendImageFromFile,
        sendReact,
        sendSucessReact,
        sendWaitReact,
        sendWarningReact,
        sendErrorReact,
        sendSuccessReply,
        sendWaitReply,
        sendWarningReact,
        sendErrorReply,
        downloadImage,
        downloadVideo,
        downloadSticker,
    };
};
