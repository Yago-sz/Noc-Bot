const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

const adapter = new JSONFile('./src/database/db.json')
const db = new Low(adapter, {
  series: {},
  userHistory: {}
})

const initDB = async () => {
  await db.read()
  db.data ||= {
    series: {},
    userHistory: {}
  }
  await db.write()
  return db
}

module.exports = initDB