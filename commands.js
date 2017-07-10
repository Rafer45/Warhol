
const staticCommands = require('./static_commands.json');
const fs = require('fs');

// Commands are called in the following manner:
// commands[command](message, config, msg, ...parameters)
// msg is the message content without the prefix or command
module.exports = {
    ping: (message) => {
        message.edit('pong!');
    },

    selfbotoff: (message) => {
        message.edit('Selfbot logging off.').then(() => {
            console.log('Forced to disconnect.');
            process.exit(0);
        });
    },

    // _ denotes arguments we don't care about
    reply: (message, _, msg) => {
        const cb = '```';
        const quotes = msg.split('.s.');
        const reply = (quotes.length > 1) ? quotes.pop() : '';

        message.edit(
            quotes.map(q => `${cb}css\n> ${q}${cb}`)
                .join('')
                .concat(reply),
        );
    },

    hideyourshame: (message, config, _, n = 0) => {
        const i = Number(n) + 1;

        message.channel.fetchMessages({ limit: 99 })
            .then((messages) => {
                messages.array()
                    .filter(m => m.author.id === config.soupmaster)
                    .slice(0, i)
                    .forEach(m => m.delete());
            });
    },

    newcommand: (message, config, msg, key) => {
        const val = msg.slice(key.length).trim();
        if (!key || !val) {
            message.channel.send('Provide a key and some content for the command.');
        } else if (!Object.keys(staticCommands).includes(key)) {
            staticCommands[key] = val;
            fs.writeFile(
                './static_commands.json',
                JSON.stringify(staticCommands, null, 4),
                console.error,
            );
            newStaticCommand(key, staticCommands[key]);
            message.channel.send(`New command added.\nCommand key: \`${key}\`\nCommand value: \`${val}\``);
        } else {
            message.channel.send('There is already a command with that key.');
        }
    },

    eval: (message, config, msg) => {
        try {
            message.channel.send(
                `Input\n\`\`\`js\n${msg}\`\`\`` +
                `Output\n\`\`\`js\n${eval(msg)}\`\`\``,
            ).catch(e => message.channel.send(e));
        } catch (e) {
            message.channel.send(e);
        }
    },
};

const newStaticCommand = (k, v) => {
    module.exports[k] = (message, _, msg) => {
        message.edit(`${msg} ${v}`);
    };
};

Object.keys(staticCommands).forEach((k) => {
    newStaticCommand(k, staticCommands[k]);
});
