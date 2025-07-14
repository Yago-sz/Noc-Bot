const { PREFIX, TEMP_DIR } = require("../../config");
const { InvalidParameterError } = require("../../errors");
const {exec} = require("child_process");
const fs = require("fs")

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
        sendStickerFromFile, // você usou isso no bloco de imagem
    }) => { if (!isImage && !isVideo) {
        throw new InvalidParameterError('Você precisa marcar uma imagem/gif/video ou responder a um.')
    };
    const outputPath = path.resolve(TEMP_DIR, "output.webp");

    if(isImage){
        const inputPath = await downloadImage(webMessage, "input")

        exec(`ffmpeg -i ${inputPath} -vf scale=512:512 ${outputPath}`, async(error) => {
            console.log(error); {
            fs.unlinkSync(inputPath)
            throw new Error(error);
            }
            await sendSucessReact()

            await sendStickerFromFile(outputPath)

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath)
        });
    } else{

    }
    }
}
       