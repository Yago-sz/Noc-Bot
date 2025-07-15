
const { verifyPrefix, hasTypeOrCommand } = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const {DangerError, WarningError, InvalidParameterError} = require("../errors")
const {findCommandImport} = require(".")

exports.dynamicCommand = async (paramHandler) => {

//

    const {commandName, prefix, sendWarningReply, sendErrorReply} = paramHandler;
 
    const {type, command} = findCommandImport(commandName); 


    if(!verifyPrefix(prefix) || !hasTypeOrCommand({type, command })) {
        return;
    }

    if(!(await checkPermission({type, ...paramHandler}))) {
      return sendErrorReply("Você não tem permissão para executar este comando!")
    }

try {
    const nome = paramHandler.webMessage?.pushName || 'Desconhecido';
  const numero = paramHandler.webMessage?.key?.remoteJid || 'Sem número';

  console.log(`🗣️ Quem digitou o comando foi: ${nome}, cujo numero é: (${numero})`);


  await command.handle({ ...paramHandler, type });
} catch (error) {
  console.log(error);

  if (error instanceof InvalidParameterError) {
    await sendErrorReply(`Parâmetros inválidos! ${error.message}`);
  } else if (error instanceof WarningError) {
    await sendWarningReply(error.message);
  } else if (error instanceof DangerError) {
    await sendErrorReply(error.message);
  } else {
    console.log(error)
    await sendErrorReply(`Ocorreu um erro ao executar o comando ${command.name}! o desenvolvedor foi notificado!

*Detalhes*: ${error.message}`);
  }
}
    }

 