
const config = require('./config.json');
const commands = require('./commands.js');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', (message) => {
    // It's a selfbot, so ignore messages from those who aren't the owner.
    if (message.author.id !== config.soupmaster
    || !message.content.startsWith(config.prefix)) return;

    const contents = message.content.slice(config.prefix.length);
    const [command, ...params] = contents.split(/ +/);
    const msg = contents.slice(command.length).trim();

    if (commands[command] !== undefined) {
        commands[command].call(client, message, config, msg, ...params);
    }
});

client.on('disconnected', () => {
    console.log('Disconnected!');
    process.exit(0);
});

client.login(config.token);
