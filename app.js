const axios = require("axios");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const token = "5507047985:AAGdjOL01o6RkKMc5ttBDCyV439WTqpIQnI";
const listIdChatToSend = ["1244226867", "5586393005"];
const bot = new TelegramBot(token, { polling: true });

setInterval(() => {
  axios
    .get(
      "https://server.autius.com/api/classes/classes-from-students?disponibility=Libres&teacherID=Todos&exitPointID=Todos&centerID=2"
    )
    .then((res) => {
      if (res?.data?.results?.length) {
        const docs = res.data.results;
        const rawDatabase = fs.readFileSync("./database.json", "utf8");
        const database = JSON.parse(rawDatabase);
        console.log(database.length);
        const docsToSave = [];
        docs.forEach((doc) => {
          const foundElement = database.find((item) => item.id === doc.id);
          if (!foundElement) {
            docsToSave.push(doc);
          }
        });
        sendNotifications(docsToSave);
        docsToSave.push(...database);
        if (docsToSave.length) {
          fs.writeFileSync("./database.json", JSON.stringify(docsToSave));
        }
      }
    });
}, 10000);

function sendNotifications(docs) {
  let message = "";
  if (docs.length) {
    console.log(docs.length);
    message = "*¡Nuevas clases!*\n\n";
    message += docs
      .map((doc) => "-" + doc.teacherName + ": " + doc.start)
      .join("\n\n");
    listIdChatToSend.forEach((idChat) => {
      bot.sendMessage(idChat, message, {
        parse_mode: "Markdown",
      });
    });
  }
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "ping") {
    bot.sendMessage(chatId, "pong");
  }
});
