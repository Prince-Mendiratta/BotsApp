const data = {
    general: {
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
        NOT_A_GROUP: "*This is not a group.*",
        BOT_NOT_ADMIN: "*I am not group admin.*",
    },
    add: {
        DESCRIPTION: "Module to add a person to a group.",
        EXTENDED_DESCRIPTION: "Use this module to add people to a group. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NUMBER_SYNTAX_ERROR: "*Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX \n\nFor example -\n```.add 9861212121```\n```.add 919861212121```",
        NO_ARG_ERROR: "*Enter the Number you want to add like '.add <NUMBER>'.*",
        NO_24HR_BAN: "*The number you're trying to add cannot be added for around 24 hours.*",
        ALREADY_MEMBER: "*The number you're trying to add is already present in the group.*",
        NOT_ON_WHATSAPP: "*The number you're trying to add is not available on WhatsApp. Please check the number again.*",
        SUCCESS: " added successfully!",
    },
    admins: {
        DESCRIPTION: "Tag admins",
        EXTENDED_DESCRIPTION: "Tag admins of a group (either as a reply to another message or a direct tag).",
        NOT_GROUP_CHAT: "*.admins*  ```command is only applicable for group chats.```",

    },
    alive: {
        DESCRIPTION: "Check if bot is online.",
        EXTENDED_DESCRIPTION: "```This module can be used to check if the bot is currently online or not.```\n\n*Example usage,*\n```.alive```",
        ALIVE_MSG: "I'm alive, {}."
    },
    block: {
        DESCRIPTION: "block contact",
        EXTENDED_DESCRIPTION: "Add number to the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    demote: {
        DESCRIPTION: "Demote a person from admin",
        EXTENDED_DESCRIPTION: "Use this module to demote a person from admin. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NOT_A_GROUP: "*This is not a group*",
        BOT_NOT_ADMIN: "*I am not group admin*",
        PERSON_NOT_IN_GROUP: "*Person is not in the group*",
        MESSAGE_NOT_TAGGED: "*Please reply or tag / enter contact of the person to be demoted*",
    },
    help: {
        DESCRIPTION: "Get the command list and info on modules.",
        EXTENDED_DESCRIPTION: "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}"
    },
    getdp: {
        DESCRIPTION: "Get display picture",
        EXTENDED_DESCRIPTION: "Get the profile picture of the group in a group conversation or the profile picture of BotsApp itself in personal chat.",
        BOT_IMAGE_CAPTION: "```Yup...  that's me. Your personal WhatsApp assistant, BotsApp.```",
        GROUP_IMAGE_CAPTION: "```Here is the display image of the chat.```",
    invite: {
        DESCRIPTION: "Module to create group invite link.",
        EXTENDED_DESCRIPTION: "Use this module to send group invite link in group or DM it to someone.",
        LINK_SENT: "```Invite link sent in DM, please check.```",
    },
    mute: {
        DESCRIPTION: "Mute group chat",
        EXTENDED_DESCRIPTION: "Mute non-admin members of a group.",
        NOT_GROUP_CHAT: "*.mute*  ```command is only applicable in a group chat.```",
        NOT_ADMIN: "```Sorry, dont have the permission to do so since I am not an admin.```",
        CHAT_ADMIN_ONLY: "```Chat permissions changed to```  *admin only*.",
        MENTION_DURATION: "```Please mention how long you want to mute the chat. For example,```\n*.mute 10 s*  ```to mute for 10 seconds.```",
        CHAT_ALL_MEMBERS: "```Chat permissions changed to```  *all group members*."
    },
    neko: {
        DESCRIPTION: "Copy your text to nekobin",
        EXTENDED_DESCRIPTION: "Use this module to paste your text to a pastebin (NEKOBIN). Enter text with the command",
        ENTER_TEXT: "*Please enter a text message with the command*",
        TRY_LATER: "*Too many tries. Please try again later*",
        PROCESSING: "```Pasting text to nekobin. Please wait...```"
    },
    promote: {
        DESCRIPTION: "Promote a person to admin",
        EXTENDED_DESCRIPTION: "Use this module to promote a person to admin. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NOT_A_GROUP: "*This is not a group*",
        BOT_NOT_ADMIN: "*I am not group admin*",
        PERSON_NOT_IN_GROUP: "*Person is not in the group*",
        MESSAGE_NOT_TAGGED: "*Please reply or tag / enter contact of the person to be promoted.*",
    },
    remove: {
        DESCRIPTION: "Module to remove a person from a group.",
        EXTENDED_DESCRIPTION: "Use this module to remove people from the group by tagging them '.remove @<person-to-remove>' or replying to them '.remove'.",
        INPUT_ERROR: "*Reply to the person you want to remove or tag them.*",

    },
    tagall: {
        DESCRIPTION: "Module to tag evryone in a group.",
        EXTENDED_DESCRIPTION: "Use this module to tag everyone in the group by either replying to a message or simply using '.tagall' command.",
        TAG_MESSAGE: "*Everyone!*",
    },
    unblock: {
        DESCRIPTION: "Unblock contact",
        EXTENDED_DESCRIPTION: "Remove number from the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    unblock: {
        DESCRIPTION: "Unblock contact",
        EXTENDED_DESCRIPTION: "Remove number from the blocklist.",
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    unmute: {
        DESCRIPTION: "Unmute group chat",
        EXTENDED_DESCRIPTION: "Unmute non-admin members of a group",
        NOT_GROUP_CHAT: "*.unmute*  ```command is only applicable for a group chat.```",
        NOT_ADMIN: "```Sorry, dont have the permissions to do so since I am not an admin.```",
        CHAT_ALL_MEMBERS: "```Chat permissions changed to```  *all group members*."
    }
};

module.exports = data;
