const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB conectado com sucesso!"))
.catch((err) => console.error("❌ Erro ao conectar ao Mongo:", err));


