import STRINGS from "../lib/db.js";
const NEWS = STRINGS.news;
import Client from "../sidekick/client";
import { proto } from "@adiwajshing/baileys";
import BotsApp from "../sidekick/sidekick";
import { MessageType } from "../sidekick/message-type";
import inputSanitization from "../sidekick/input-sanitization";
import Axios from "axios";
import fs from "fs";

module.exports = {
  name: "news",
  description: NEWS.DESCRIPTION,
  extendedDescription: NEWS.EXTENDED_DESCRIPTION,
  demo: { isEnabled: false },

  async handle(
    client: Client,
    chat: proto.IWebMessageInfo,
    BotsApp: BotsApp,
    args: string[]
  ): Promise<void> {
    /*******************************************
     *
     *
     * Functions
     *
     *
     ********************************************/
    const checkPub = async (newsList: string[], requestedPub: string) => {
      for (let i = 0; i < newsList.length; i++) {
        if (newsList[i].toUpperCase == requestedPub.toUpperCase) {
          return newsList[i];
        }
        return;
      }
    };
    /*******************************************
     *
     *
     * Actions
     *
     *
     ********************************************/
    if (args.length === 0) {
      await client
        .sendMessage(BotsApp.chatId, NEWS.NO_COMMMAND, MessageType.text)
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      return;
    }
    if (args[0] == "help") {
      await client
        .sendMessage(
          BotsApp.chatId,
          NEWS.EXTENDED_DESCRIPTION,
          MessageType.text
        )
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      return;
    }
    if (args[0] == "search") {
      args.shift();
      var searchTerm = args.join(" ");
      let searchResponse;
      await Axios.get(
        "http://localhost:3000/news-list?searchTerm=" + searchTerm
      )
        .then((res) => {
          searchResponse = res.data;
        })
        .catch((error) => {
          console.error(error);
        });

      for (let i = 0; i < searchResponse.length; i++) {
        searchResponse[i] = `${i + 1}` + ".)  " + `${searchResponse[i]}`;
      }

      let message = searchResponse.join("\n\n");
      await client
        .sendMessage(BotsApp.chatId, message, MessageType.text)
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      return;
    }
    if (args[0] == "fetch") {
      args.shift();
      var searchTerm = args.join(" ");
      let searchResponse;
      await Axios.get(
        "http://localhost:3000/news-list?searchTerm=" + searchTerm
      )
        .then((res) => {
          searchResponse = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
      let foundPub = await checkPub(searchResponse, searchTerm);
      let message =
        "```Your requested publication``` *" +
        foundPub +
        "* ```is being fetched by BotsApp, this may take some time, please be patient!```";
      if (!foundPub) {
        message = "```Sorry, no publication found by that name!```";
        await client
          .sendMessage(BotsApp.chatId, message, MessageType.text)
          .catch((err) => inputSanitization.handleError(err, client, BotsApp));
        return;
      }
      await client
        .sendMessage(
          BotsApp.chatId,
          {
            url:
              "http://localhost:3000/news?pubName=" + foundPub + "&format=pdf",
          },
          MessageType.document,
          {
            mimetype: "application/pdf",
            filename: foundPub + ".pdf",
            caption: message,
          }
        )
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      message = "```Your requested publication fetched by BotsApp``` ☝️";
      await client
        .sendMessage(BotsApp.chatId, message, MessageType.text)
        .catch((err) => inputSanitization.handleError(err, client, BotsApp));
      return;
    }
  },
};
