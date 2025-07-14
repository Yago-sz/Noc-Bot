const {connect} = require("./connect");
const {load} = require("./load")

async function start(){
  const socket = await connect();

  load(socket)
}
start()