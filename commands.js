
const staticCommands = require('./static_commands.js');

// Commands are called in the following manner:
// commands[command](message, config, msg, ...parameters)
// msg is the message content without the prefix or command
module.exports = {
    ping: (message) => {
        message.edit('pong!');
    },

    selfbot_off: (message) => {
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

Object.keys(staticCommands).forEach((k) => {
    module.exports[k] = (message, _, msg) => {
        message.edit(`${msg} ${staticCommands[k]}`);
    };
});
