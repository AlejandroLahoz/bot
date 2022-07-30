import axios from "axios";
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
const token = "5507047985:AAGdjOL01o6RkKMc5ttBDCyV439WTqpIQnI";

const bot = new TelegramBot(token, { polling: true });

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
      console.log(docs.length);
      docs.forEach((doc) => {
        const foundElement = database.find((item) => item.id === doc.id);
        if (!foundElement) {
          docsToSave.push(doc);
        }
      });
      docsToSave.push(...database);
      fs.writeFileSync("./database.json", JSON.stringify(docsToSave));
    }
  });
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);
});
