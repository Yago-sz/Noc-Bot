const {PREFIX} = require ("../../config")



module.exports = {
    name: 'comando',
    description: 'Descrição do comando',
    commands: ['comando 1', 'comando 2'],
    usage: `${PREFIX}comando`,
    handle: async({}) => {
        //codigo do comando
    }
};
