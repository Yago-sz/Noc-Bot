const {PREFIX} = require ("../../config")
const {consultarCep} = require('correios-brasil');


module.exports = {
    name: 'cep',
    description: 'Consulta o seu Cep',
    commands: ['Cep', ],
    usage: `${PREFIX}cep 01001-001`,
    handle: async({args, sendWarningReply, sendSuccessReply}) => {
        const cepSearch = args[0]; 

        if(!cepSearch || ![8, 9] .includes(cepSearch.length)) {
            return sendWarningReply(
                "Você precisa informar um CEP no formato 00000-000 ou 00000000"
            );
        }
     try{
  const resultado = await consultarCep(cepSearch);

if (!resultado || !resultado.cep) {
    await sendWarningReply("CEP não encontrado!");
    return;
}

await sendSuccessReply(`*Resultado*

*CEP*: ${resultado.cep}
*Logradouro*: ${resultado.logradouro}
*Complemento*: ${resultado.complemento}
*Bairro*: ${resultado.bairro}
*Localidade*: ${resultado.localidade}
*UF*: ${resultado.uf}
*IBGE*: ${resultado.ibge}`);
     } catch(error) {
        console.log(error);
        throw new Error("Erro ao consultar o CEP")
     }
    },
};
