const { downloadContentFromMessage } = require("baileys");
const readline = require("readline");
const { text } = require("stream/consumers");
const path = require('path');
const { writeFile } = require("fs/promises");
const { TEMP_DIR, COMMANDS_DIR, PREFIX } = require("../config");
const fs = require ("fs")

exports.question = (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => rl.question(message, resolve))
};

exports.onlyNumbers = (text) => text.replace(/\D/g, "");

exports.extractDataFromMessage = (webMessage) => {
    const textMessage = webMessage.message?.conversation;
    const extendedTextMessage = webMessage.message?.extendedTextMessage;
    const extendedTextMessageText = extendedTextMessage?.text;
    const imageTextMessage = webMessage.message?.imageTextMessage?.caption;
    const videoTextMesssage = webMessage?.videoTextMesssage?.caption;

    const fullMessage = textMessage || extendedTextMessageText || imageTextMessage || videoTextMesssage;

    if (!fullMessage) {
        return {
            remoteJid: null,
            userJid: null,
            prefix: null,
            commandName: null,
            isReply: null,
            replyJid: null,
            args: {},
        };
    }

    const isReply = !!(extendedTextMessage && extendedTextMessage.contextInfo?.quotedMessage);

    const replyJid = extendedTextMessage?.contextInfo?.participant || null;

    const userJid = webMessage?.key.participant?.replace(
        /:[0-9] [0-9] |:[0-9]/g,
        ""
    );

    const split = fullMessage.trim().split(/\s+/);
    const command = split[0] || "";
    const args = split.slice(1);

    const prefix = command.charAt(0);
    const commandWithoutPrefix = command.slice(1); // Remove apenas o primeiro caractere

    return {
        remoteJid: webMessage.key?.remoteJid,
        prefix,
        userJid,
        replyJid,
        isReply,
        commandName: this.formatCommand(commandWithoutPrefix),
        args: this.splitByCharacters(args.join(" "), ["\\", "|", "/"]),
    };
};

exports.splitByCharacters = (str, characters) =>{
    characters = characters.map((char) => (char === "\\" ? "\\\\" : char))
    const regex = new RegExp(`[${characters.join("")}]`);

    return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean)
}

exports.formatCommand = (text) => {
    return this.onlyLettersAndNumbers(
        this.removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
    );
};

exports.onlyLettersAndNumbers = (text) => {
    return text.replace(/[^a-zA-Z0-9]/g, "");
}


exports.removeAccentsAndSpecialCharacters = (text) => {
    if(!text) return "";

    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
exports.baileysIs = (webMessage, context) => {
    return !!exports.getContent(webMessage, context);
};

exports.getContent = (webMessage, context) => {
    webMessage.message?.[`${context}Message`] ||
    webMessage.message?.extendedTextMessagemessage?.contextInfo?.quotedMessage?.[
        `${context}Message`
    ]
}

exports.download = async (webMessage, filename, context, extension) => {
    const content = this.getContent(webMessage, context);
    if(!content) {
        return null;
    }

    const stream = await downloadContentFromMessage(content, context);

    let buffer = Buffer.from([])

    for await (const chunk of stream ) {
        buffer = Buffer.concat([buffer, chunk])
    }

    const filePath = path.resolve(TEMP_DIR, `${filename}.${extension}`)

    await writeFile(filePath, buffer);
}

exports.findCommandImport = (commandName) => {
    const command = this.readCommandImports();

    let typeReturn = ""
 let targetCommandReturn = null;
    
    for (const [type, commands] of Object.entries(command)) {
        if(!commands.length) {
            continue;
        }
        const targetCommand = commands.find((cmd) =>
            cmd.commands.map((cmd) => this.formatCommand(cmd)).includes(commandName)
        )
        if(targetCommand) {
            typeReturn = type;
            targetCommandReturn = targetCommand;
            break;
        }
    }

    return {
    type: typeReturn,
    command: targetCommandReturn,
};
};

exports.readCommandImports = () => {
    const subdirectories = fs.readdirSync(COMMANDS_DIR, {withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name);

    const commandImports = {};
    for (const subdir of subdirectories) {
        const subdirectoryPath = path.join(COMMANDS_DIR, subdir);
        const files = fs
        .readdirSync(subdirectoryPath)
        .filter(
        (file) => 
        !file.startsWith("_") && 
        file.endsWith(".js") || file.endsWith(".ts"))
        
        .map((file) => require(path.join(subdirectoryPath, file)))
        
        commandImports[subdir] = files;

        
    }
        return commandImports;
}

