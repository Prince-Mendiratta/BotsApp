export
const String = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const BOOK = String.book
const TRANSMIT = require('../core/transmission')
const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = {
    name: "book",
    description: BOOK.DESCRIPTION,
    extendedDescription: BOOK.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".book no sweetness here",
            ".book 978-18-78707-52-9",
            ".book 0-7645-3537-4"
        ],
    },
    async handle(client, chat, BotsApp, args) {
        try {

            if (args.length === 0)
                return  await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:BOOK.NO_INPUT})


            const search_text = args.join(" ").replace(/[^A-Za-z0-9\s]/g,'')


            await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:BOOK.SEARCHING_BOOK})

            const { stdout, stderr } = await exec(`python3 zlibrary/main.py "${search_text}"`);

            if(stderr){
                if(stderr == "book not found")
                   return await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:BOOK.BOOK_NOT_FOUND})

                else
                   return  await inputSanitization(await inputSanitization.handleError(stderr, client, BotsApp))
            }

            const book = JSON.parse(stdout)

            await TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:BOOK.DOWNLOADING_BOOK})

            const year = book["year"] ? book["year"] : "N/A"
            const publisher = book["publisher"] ? book["publisher"] : "N/A"
            const pages = book["pages"] ? book["pages"] : "N/A"
            const language = book["language"] ? book["language"] : "N/A"
            const isbn10 = book["ISBN 10"] ? book["ISBN 10"] : "N/A"
            const isbn13 = book["ISBN 13"] ? book["ISBN 13"] : "N/A"
            const categories = book["categories"] ? book["categories"] : "N/A"
            const description = book["description"] ? book["description"] : "N/A"

            const caption =
                "*Name :* " + book["name"] +
                "\n*Year :* " + year +
                "\n*Publisher :* " + publisher +
                "\n*Pages :* " + pages +
                "\n*Language :* " + language +
                "\n*ISBN 10 :* " + isbn10 +
                "\n*ISBN 13 :* " + isbn13 +
                "\n*Categories :* " + categories +
                "\n*Extension :* " + book["extension"] +
                "\n\n*Description :* " + description

            const file_name = book["name"].replace(/\W/g,'_') + "."+ book["extension"].toLowerCase()

            const mimeType = book["extension"] === "PDF" ? "application/pdf" : "application/epub+zip"

            await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{image:{url:book["cover"]},caption:caption,thumbnail:null})

            await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{
                document:{url:book["downloaded_book_location"]},
                fileName:file_name,
                mimetype:mimeType,
                pageCount:book["pages"]?book["pages"]:""
            }).catch(err => inputSanitization.handleError(err, client, BotsApp));

            if(book["extension"] === "EPUB") {

                await  TRANSMIT.sendMessageWTyping(client,BotsApp.chat,{text:"```Install this free EPUB reader to read your book```"})

                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {
                    document: {url: './zlibrary/epub_reader.apk'},
                    fileName: 'epub_reader.apk',
                    mimetype: 'application/vnd.android.package-archive'
                }).catch(err => inputSanitization.handleError(err, client, BotsApp));
            }
            return await inputSanitization.deleteFiles(book["downloaded_book_location"])

        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    }
}