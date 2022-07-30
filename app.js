const axios = require("axios");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const token = "5507047985:AAGdjOL01o6RkKMc5ttBDCyV439WTqpIQnI";
const listIdChatToSend = ["1244226867", "5586393005"];
const bot = new TelegramBot(token, { polling: true });

console.log("Online!");

setInterval(() => {
  axios
    .get(
      "https://www.empleate.gob.es/empleate/open/offersearch/selectBuscador?q.op=AND&rows=100&sort=score%20desc&defType=edismax&df=titulo&facet=true&facet.field=paisF&facet.field=provinciaF&facet.field=provincia&facet.field=categoria&facet.field=categoriaF&facet.field=subcategoriaF&facet.field=subcategoria&facet.field=origen&facet.field=tipoContratoN&facet.field=noMeInteresa&facet.field=educacionF&facet.field=fechaCreacionPortal&facet.field=jornadaF&facet.field=experienciaF&facet.field=educacion&facet.field=minExperiencia&facet.field=jornada&facet.field=pais&facet.field=discapacidad&facet.field=cno&facet.mincount=1&f.topics.facet.limit=50&json.nl=map&fq=provincia%3A%2250%22&fq=(speStateId%3A1%20OR%20speStateId%3A4)%20AND%20checkVisible%3A1&fl=*%2C%20score&q=Programa%20investigo&wt=json"
    )
    .then((res) => {
      if (res?.data?.response?.docs?.length) {
        const { docs } = res.data.response;
        const rawDatabase = fs.readFileSync("./database.json", "utf8");
        const database = JSON.parse(rawDatabase);
        const docsToSave = [];
        docs.forEach((doc) => {
          const foundElement = database.find((item) => item.id === doc.id);
          if (!foundElement) {
            docsToSave.push(doc);
          }
        });
        sendNotifications(docsToSave);
        if (docsToSave.length) {
          docsToSave.push(...database);
          fs.writeFileSync("./database.json", JSON.stringify(docsToSave));
        }
      }
    });
}, 43200000);

function sendNotifications(docs) {
  let message = "";
  if (!docs.length) {
    message = "No hay nuevos empleos";
  } else {
    message = "*¡Nuevos empleos!*\n\n";
    message += docs.map((doc) => "- " + doc.titulo).join("\n\n");
  }
  listIdChatToSend.forEach((idChat) => {
    bot.sendMessage(idChat, message, {
      parse_mode: "Markdown",
    });
  });
}

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "ping") {
    bot.sendMessage(chatId, "pong");
  }
});
