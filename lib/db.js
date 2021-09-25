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
    block: {
        DESCRIPTION: "block contact",
        EXTENDED_DESCRIPTION: "Add number to the blocklist.",
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
    help: {
        DESCRIPTION: "Get the command list and info on modules.",
        EXTENDED_DESCRIPTION: "This module is used to get info on other modules and their triggers.",
        HEAD: "🌀 *BotsApp Menu* 🌀\n```Use .help command for detailed info on a module.```",
        TEMPLATE: "\n\n🤖 *Command* - ```{}```\n💡 *Info* - ```{}```",
        COMMAND_INTERFACE: "🌀 *BotsApp Command Interface* 🌀\n\n",
        COMMAND_INTERFACE_TEMPLATE: "💠 *Triggers -* ```{}```\n📚 *Info -* {}"
    }
};

module.exports = data;
