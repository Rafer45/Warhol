
const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const commands = require('./commands.js')

client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', (message) => {
    // It's a selfbot, so ignore messages from those who aren't the owner.
    if (message.author.id !== config.soupmaster || !message.content.startsWith(config.prefix)) return;

    let _content = message.content.slice(config.prefix.length),
        [command, ...params] = _content.split(/ +/),
        msg = _content.slice(command.length + 1);

    if (commands[command] !== undefined) {
        commands[command].call(client, message, config, msg, ...params);
    }
});

client.on('disconnected', () => {
    console.log("Disconnected!");
    process.exit(0);
});

client.login(config.token);
