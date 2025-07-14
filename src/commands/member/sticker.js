const { PREFIX, TEMP_DIR } = require("../../config");
const { InvalidParameterError } = require("../../errors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: 'sticker',
    description: 'Faça uma figurinha de uma Imagem/Gif e Video.',
    commands: ['sticker', 'figurinha', `fig`, `s`, `f`],
    usage: `${PREFIX}sticker (marque a imagem/gif/video) ou ${PREFIX}sticker (Responda a imagem/gif/video)`,

    handle: async ({
        isImage,
        isVideo,
        downloadImage,
        downloadVideo,
        webMessage,
        sendErrorReply,
        sendSucessReact,
        sendStickerFromFile,
    }) => {

        console.log("🔍 Verificando antes da validação final:");
        console.log("isImage (verificação final):", isImage);
        console.log("isVideo (verificação final):", isVideo);

        if (!isImage && !isVideo) {
            throw new InvalidParameterError('Você precisa marcar uma imagem/gif/video ou responder a um.');
        }

        const outputPath = path.resolve(TEMP_DIR, "output.webp");

        if (isImage) {
            const inputPath = await downloadImage(webMessage, "input");

            console.log("📥 Imagem baixada em:", inputPath);

      exec(`ffmpeg -i ${inputPath} -vf "crop='min(iw,ih)':'min(iw,ih)',scale=512:512" -y -lossless 1 -compression_level 6 -preset picture -an -vsync 0 -f webp ${outputPath}`, async (error) => {
                if (error) {
                    console.error("❌ Erro no ffmpeg (imagem):", error);
                    fs.unlinkSync(inputPath);
                    throw new Error(error);
                }

                console.log("✅ FFMPEG finalizou (imagem)");
                console.log("📦 Arquivo gerado:", outputPath);
                console.log("📦 Arquivo existe?", fs.existsSync(outputPath));
                if (fs.existsSync(outputPath)) {
                    console.log("📦 Tamanho:", fs.statSync(outputPath).size);
                } else {
                    console.log("🚫 Arquivo não encontrado, não foi gerado corretamente.");
                }

                await sendSucessReact();

                console.log("📤 Enviando figurinha...");
                await sendStickerFromFile(outputPath);
                console.log("🎉 Figurinha enviada!");

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });

        } else {
            const inputPath = await downloadVideo(webMessage, "input");
            const sizeInSeconds = 10;

            const seconds =
                webMessage.message?.videoMessage?.seconds ||
                webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.seconds;

            const haveSecondsRule = seconds < sizeInSeconds;

            if (!haveSecondsRule) {
                fs.unlinkSync(inputPath);
                await sendErrorReply(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!!

Envie um vídeo menor!`);
                return;
            }

            console.log("📥 Vídeo baixado em:", inputPath);

       exec(`ffmpeg -i ${inputPath} -y -filter_complex "[0:v] fps=12,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0,split[a][b];[a]palettegen[p];[b][p]paletteuse" -loop 0 -f webp ${outputPath}`, async (error) => {
                    if (error) {
                        console.error("❌ Erro no ffmpeg (vídeo):", error);
                        fs.unlinkSync(inputPath);
                        throw new Error(error);
                    }

                    console.log("✅ FFMPEG finalizou (vídeo)");
                    console.log("📦 Arquivo gerado:", outputPath);
                    console.log("📦 Arquivo existe?", fs.existsSync(outputPath));
                    if (fs.existsSync(outputPath)) {
                        console.log("📦 Tamanho:", fs.statSync(outputPath).size);
                    } else {
                        console.log("🚫 Arquivo não encontrado, não foi gerado corretamente.");
                    }

                    await sendSucessReact();

                    console.log("📤 Enviando figurinha...");
                    await sendStickerFromFile(outputPath);
                    console.log("🎉 Figurinha enviada!");

                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                });
        }
    }
}