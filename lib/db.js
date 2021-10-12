const data = {
    general: {
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
        NOT_A_GROUP: "*This is not a group.*",
        BOT_NOT_ADMIN: "*I am not group admin.*"
    },
    add: {
        DESCRIPTION: "Module to add a person to a group.",
        EXTENDED_DESCRIPTION:
            "Use this module to add people to a group. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NUMBER_SYNTAX_ERROR:
            "*Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX \n\nFor example -\n```.add 9861212121```\n```.add 919861212121```",
        NO_ARG_ERROR:
            "*Enter the Number you want to add like '.add <NUMBER>'.*",
        NO_24HR_BAN:
            "*The number you're trying to add cannot be added for around 24 hours.*",
        ALREADY_MEMBER:
            "*The number you're trying to add is already present in the group.*",
        NOT_ON_WHATSAPP:
            "*The number you're trying to add is not available on WhatsApp. Please check the number again.*",
        SUCCESS: " added successfully!"
    },
    admins: {
        DESCRIPTION: "Tag admins",
        EXTENDED_DESCRIPTION:
            "Tag admins of a group (either as a reply to another message or a direct tag).",
        NOT_GROUP_CHAT:
            "*.admins*  ```command is only applicable for group chats.```"
    },
    alive: {
        DESCRIPTION: "Check if bot is online.",
        EXTENDED_DESCRIPTION:
            "```This module can be used to check if the bot is currently online or not.```\n\n*Example usage,*\n```.alive```",
        ALIVE_MSG: "I'm alive, {}."
    },
    block: {
        DESCRIPTION: "block contact",
        EXTENDED_DESCRIPTION: "Add number to the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number"
    },
    carbon: {
        DESCRIPTION: "Convert text/code to a carbon image.",
        EXTENDED_DESCRIPTION: "```This module can be used to convert text/code into pretty carbon images.```\n\n*Example Usage,*\n```.carbon <text>```\n```.carbon``` and reply to a text message.",
        NO_INPUT: "*No input provided.*\n```Please use the command '.carbon <text>' or reply to a text message with '.carbon' to carbonize the text.",
        CARBONIZING: "```Carbonizing your text, please wait...```",
        OUTPUT: "<< ```Here's your carbon!``` >>\n*Carbonized by BotsApp*\n*Colour Scheme:* ```{}```",
        INVALID_REPLY: "*The replied message must be text.*",
        INVALID_THEME: "*Please enter the valid theme.*\n```Do note that theme names are case sensitive.```"
    },
    demote: {
        DESCRIPTION: "Demote a person from admin",
        EXTENDED_DESCRIPTION:
            "Use this module to demote a person from admin. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NOT_A_GROUP: "*This is not a group*",
        BOT_NOT_ADMIN: "*I am not group admin*",
        PERSON_NOT_IN_GROUP: "*Person is not in the group*",
        MESSAGE_NOT_TAGGED:
            "*Please reply or tag / enter contact of the person to be demoted*"
    },
    disappear: {
        DESCRIPTION: "Toggle disappearing messages",
        EXTENDED_DESCRIPTION: "Toggle disappearing messages by using command '.dissapear' "
    },
    getdp: {
        DESCRIPTION: "Get display picture",
        EXTENDED_DESCRIPTION: "Get the profile picture of the group in a group conversation or the profile picture of BotsApp itself in personal chat.",
        IMAGE_CAPTION: "```Here is the display image.```",
    },
    github: {
        DESCRIPTION: "Github Profile",
        EXTENDED_DESCRIPTION: "Get the github profile by command '.github <user>' or replying '.github'.",
        NO_ARG_ERROR:"*Please enter <user_name>*",
        ERROR_MSG:"*Please Enter a valid username!*\n```Like '.github <user_name>' or Reply '.github' to <user_name>```",
        FETCHING: "```Fetching user details from Github, please wait...```"
    },
    help: {
        DESCRIPTION: "Get the command list and info on modules.",
        EXTENDED_DESCRIPTION:
            "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}"
    },
    invite: {
        DESCRIPTION: "Module to create group invite link.",
        EXTENDED_DESCRIPTION:
            "Use this module to send group invite link in group or DM it to someone.",
        LINK_SENT: "```Invite link sent in DM, please check.```"
    },
    lyrics: {
        DESCRIPTION: "Module to find lyrics of song",
        EXTENDED_DESCRIPTION: "Use this module to find lyrics of a song using '.lyrics' command.",
        NO_ARG: "```Please Enter a Song name```",
        NOT_FOUND: "```Song Not Found!```",
        PROCESSING: "```Searching Please wait....```"
    },
    mute: {
        DESCRIPTION: "Mute group chat",
        EXTENDED_DESCRIPTION: "Mute non-admin members of a group.",
        NOT_GROUP_CHAT:
            "*.mute*  ```command is only applicable in a group chat.```",
        NOT_ADMIN:
            "```Sorry, dont have the permission to do so since I am not an admin.```",
        CHAT_ADMIN_ONLY: "```Chat permissions changed to```  *admin only*.",
        MENTION_DURATION:
            "```Please mention how long you want to mute the chat. For example,```\n*.mute 10 s*  ```to mute for 10 seconds.```",
        CHAT_ALL_MEMBERS:
            "```Chat permissions changed to```  *all group members*."
    },
    neko: {
        DESCRIPTION: "Copy your text to nekobin",
        EXTENDED_DESCRIPTION:
            "Use this module to paste your text to a pastebin (NEKOBIN). Enter text with the command",
        ENTER_TEXT: "*Please enter a text message with the command*",
        TRY_LATER: "*Too many tries. Please try again later*",
        PROCESSING: "```Pasting text to nekobin. Please wait...```"
    },
    ocr: {
        DESCRIPTION: "Optical Character Recognition",
        EXTENDED_DESCRIPTION: "Use this module to get text from imgae by '.ocr' command",
        PROCESSING: "```Processing Please wait...```",
        ERROR_MSG:"*Please Tag a Valid Message*"
    },
    promote: {
        DESCRIPTION: "Promote a person to admin",
        EXTENDED_DESCRIPTION:
            "Use this module to promote a person to admin. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NOT_A_GROUP: "*This is not a group*",
        BOT_NOT_ADMIN: "*I am not group admin*",
        PERSON_NOT_IN_GROUP: "*Person is not in the group*",
        MESSAGE_NOT_TAGGED:
            "*Please reply or tag / enter contact of the person to be promoted.*"
    },
    remove: {
        DESCRIPTION: "Module to remove a person from a group.",
        EXTENDED_DESCRIPTION:
            "Use this module to remove people from the group by tagging them '.remove @<person-to-remove>' or replying to them '.remove'.",
        INPUT_ERROR: "*Reply to the person you want to remove or tag them.*"
    },
    setdp: {
        DESCRIPTION: "Change the group icon",
        EXTENDED_DESCRIPTION: 
            "Use this module to change the group's icon. Tag image with the command or send the desired image with caption as the command",
        NOT_AN_IMAGE: "```Please reply or caption the image you want to make the group icon```",
        NOT_A_GROUP: "*This is not a group*",
        ICON_CHANGED: "```Icon is being changed```"
    },
    song: {
        ENTER_SONG: "```Enter song with the command```",
        SONG_NOT_FOUND: "```Could not find the song check whether the link or keyword entered is correct.```",
        DOWNLOADING: "```Downloading your song...```",
        UPLOADING: "```Uploading song...```",
        INTRO: ""
    },
    sticker: {
        DESCRIPTION: "Module to convert image to sticker",
        EXTENDED_DESCRIPTION:
            "Use this module to convert any image from your chat to a sticker. Reply to an image message with the command '.sticker' to convert and send that image as a sticker.",
        TAG_A_VALID_MEDIA_MESSAGE:
            "*Please tag a valid image/video/gif message to convert to sticker.*",
        DOWNLOADING: "```Your sticker is downloading, Please wait...```"
    },
    stoi: {
        DESCRIPTION: "Module to convert sticker to image",
        EXTENDED_DESCRIPTION:
            "Use this module to convert any sticker from your chat to an image. Reply to a sticker message with the command '.stoi' to convert and send that sticker as an image.",
        ANIMATED_STICKER_ERROR : "Tagged sticker message is animated , *Can not convert animated sticker to image* , Try again with a static sticker.",
        TAG_A_VALID_STICKER_MESSAGE:
            "*Please tag a valid sticker message to convert to an image.*",
        DOWNLOADING: "```Your image is downloading, Please wait...```",
        ERROR: "```Woops, something went wrong. Try again later, or proabaly not with this again...```"
    },
    tr: {
        DESCRIPTION: "Language Translator",
        EXTENDED_DESCRIPTION: "Use ```.tr <text> | <language>```  to translate text. You can also reply to a text message with syntax ```.tr <language>``` to translate text.",
        PROCESSING: "```Translating Please wait...```",
        TOO_LONG: "*Total characters should be less than 4000.*\n```Total characters for current input were``` ```{}.```",
        LANGUAGE_NOT_SUPPORTED: "*Language is invalid.*",
        INVALID_REPLY: "*Please reply to a text message.*",
        SUCCESS: "*TR:* Translate [*{}* -> *{}*]\n\n{}"
    },
    tts: {
        DESCRIPTION: "Text To Speech.",
        EXTENDED_DESCRIPTION: "Use '.tts <text>' or '.tts <text> | <language_code>' to convert text to speech.\nYou can also reply to a text message with syntax ```.tr <language>``` to translate text.",
        PROCESSING: "```Converting Text To Speech. Please wait...```",
        TOO_LONG: "*Total characters should be less than 200.*\n```Total characters for current input were``` ```{}.```",
        INVALID_LANG_CODE: "*The Language Code was incorrect.*\n```The Language Code is generally the first two letters of the language you're trying to convert to.```"
    },
    tagall: {
        DESCRIPTION: "Module to tag evryone in a group.",
        EXTENDED_DESCRIPTION:
            "Use this module to tag everyone in the group by either replying to a message or simply using '.tagall' command.",
        TAG_MESSAGE: "*Everyone!*"
    },
    ud: {
        DESCRIPTION: "Urban Dictionary",
        EXTENDED_DESCRIPTION: "Use this module to find meaning of a word in Urban Dictionary using '.ud' command.",
        NO_ARG: "```Please Enter a word to search for.```",
        NOT_FOUND: "```Term``` *{}* ```Not Found!```",
        PROCESSING: "```Searching, please wait....```"
    },
    unblock: {
        DESCRIPTION: "Unblock contact",
        EXTENDED_DESCRIPTION: "Remove number from the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number"
    },
    unmute: {
        DESCRIPTION: "Unmute group chat",
        EXTENDED_DESCRIPTION: "Unmute non-admin members of a group",
        NOT_GROUP_CHAT:
            "*.unmute*  ```command is only applicable for a group chat.```",
        NOT_ADMIN:
            "```Sorry, dont have the permissions to do so since I am not an admin.```",
        CHAT_ALL_MEMBERS:
            "```Chat permissions changed to```  *all group members*."
    },
    weather: {
        DESCRIPTION: "Get weather data of a city",
        EXTENDED_DESCRIPTION:
            "Get weather data and conditions simply by sending a city name",
        WEATHER_DATA:
            "*Temperature:* {tempInC} °C | {tempInF} °F\n*Min Temp:* {minTempInC} °C | {minTempInF} °F\n*Max Temp:* {maxTempInC} °C | {maxTempInF} °F\n*Humidity:* {humidity}%\n*Wind:* {windSpeedInkmph} kmph | {windSpeedInmph} mph , {degree}°\n*Sunrise:* {sunriseTime}\n*Sunset:* {sunsetTime}\n\n\n*{weatherDescription}*\n{cityName} , {country}\n{dateAndTime}",
        CITY_NAME_REQUIRED:
            "*Please mention the city name to search weather data.*",
            ERROR_OCCURED: "*Woops, cannot process this request. Check city name and try again*",
            DOWNLOADING: "```Processing data, Please wait...```"
    },
    welcome: {
        DESCRIPTION: "Welcome new members to group with a custom message.",
        EXTENDED_DESCRIPTION: 
            "New members in a group chat will be welcomed with a message. It can be an image, video, gif with caption or text message.",
        NOT_A_GROUP: "```This is not a group,```",
        SET_WELCOME_FIRST: "```Set a welcome message first.```",
        GREETINGS_ENABLED: "```Welcome message have been enabled.```",
        GREETINGS_UNENABLED: "```Welcome message have been disabled.```",
        CURRENTLY_ENABLED: "```Greetings are enabled: True \nCurrently greeting new members with:```",
        CURRENTLY_DISABLED: "```Greetings are enabled: False \nCurrently greeting new members with:```",
        WELCOME_DELETED: "```Welcome message deleted.```",
        WELCOME_UPDATED: "```Welcome message updated and enabled.```"
    },
    goodbye: {
        DESCRIPTION: "A goodbye message for group chat whenever someone leaves.",
        EXTENDED_DESCRIPTION: 
            "A parting message will be sent to members leaving the group both on the group and in the personal set by the pre existing members of the group.",
        NOT_A_GROUP: "```This is not a group```",
        SET_GOODBYE_FIRST: "```Set a goodbye message first.```",
        GREETINGS_ENABLED: "```Goodbye message have been enabled.```",
        GREETINGS_UNENABLED: "```Goodbye message have been disabled.```",
        CURRENTLY_ENABLED: "```Greetings are enabled: True \nCurrently greeting new members with:```",
        CURRENTLY_DISABLED: "```Greetings are enabled: True \nCurrently greeting new members with:```",
        GOODBYE_DELETED: "```Goodbye message deleted.```",
        GOODBYE_UPDATED: "```Goodbye message updated and enabled.```"
    },
    yt: {
        DESCRIPTION: "Get recommendations and links from Youtube",
        EXTENDED_DESCRIPTION: 
            "Get top 10 recommendations from Youtube with their authorname, timestamp and link. Write the keywords that are wanted to be serched with the command.",
        REPLY: "```Getting the recommendations```",
        NO_VIDEOS: "```No videos could be found```"
    }
};

module.exports = data;
