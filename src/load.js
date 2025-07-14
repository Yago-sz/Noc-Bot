const { TIMEOUT_IN_MILLISESCONDS_BY_EVENT } = require("./config");
const { OnMessagesUpsert } = require('./middlewares/onMessagesUpsert'); // <- importa corretamente

exports.load = (socket) => {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        await OnMessagesUpsert({ socket, messages }); // <- await pois é async
        setTimeout(() => {}, TIMEOUT_IN_MILLISESCONDS_BY_EVENT);
    });
};