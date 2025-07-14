const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const apiKey = process.env.OPENROUTER_API_KEY;

exports.API_KEY = apiKey;

exports.TIMEOUT_IN_MILLISESCONDS_BY_EVENT = 500
exports.PREFIX = "/"
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp")
exports.BOT_EMOJI = "🤠"
exports.BOT_NAME = "Noc Bot"
exports.BOT_NUMBER = "5521988345696";

exports.COMMANDS_DIR = path.resolve(__dirname, "commands")


