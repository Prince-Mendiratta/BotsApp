const data = {
    general: {
        NUMBER_SYNTAX_ERROR:
            "Enter a valid contact number. Valid syntax,\n    1. XXXXXXXXXX\n    2. Tag the person\n    3. +YYXXXXXXXXXX (YY- Country Code, without zeros)",
        MESSAGE_NOT_TAGGED: "Tag a message or enter a number",
    },
    alive: {
        DESCRIPTION: "Check if bot is online.",
        EXTENDED_DESCRIPTION: "```This module can be used to check if the bot is currently online or not.```\n\n*Example usage,*\n```.alive```",
        ALIVE_MSG: "I'm alive, {}."
    },
    add: {
        DESCRIPTION: "Module to add a person to a group.",
        EXTENDED_DESCRIPTION: "Use this module to add people to a group. You can enter the person's mobile number. *Valid Syntaxes -*\n1. XXXXXXXXXX\n2. YYXXXXXXXXXX ()\n\nFor example -\n```.add 9861212121```",
        NO_TAG_ERROR: ""
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
    help: {
        DESCRIPTION: "Get the command list and info on modules.",
        EXTENDED_DESCRIPTION: "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}"
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
