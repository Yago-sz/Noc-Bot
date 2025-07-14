const { LoadCommomFunctions } = require('../utils/LoadCommomFunctions'); // <- com L maiúsculo e chaves
const {dynamicCommand} = require("../utils/dynamicCommand")
exports.OnMessagesUpsert = async ({socket, messages}) => {
    if(!messages.length) {
        return;
    }
    const webMessage = messages[0];
    const commomFunctions = LoadCommomFunctions({socket,webMessage})

    await dynamicCommand(commomFunctions);
}