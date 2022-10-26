type demo = {
    isEnabled: boolean;
    text: any;
}

type Command = {
    name: string;
    description: string;
    extendedDescription: string;
    demo: demo;
    handle: Function;
}

export = Command;