
// Commands are called in the following manner:
// commands[command](message, config, msg, ...parameters)
// msg is the message content without the prefix or command
module.exports = {
    'ping': (message) => {
        message.edit("pong!");
    },

    // _ denotes arguments we don't care about
    'selfbot_off': (message) => {
        message.edit("Selfbot logging off.").then(() => {
            console.log("Forced to disconnect.");
            process.exit(0);
        });
    },

    'reply': (message, _, msg) => {
        let arr = msg.split(/\.s\.(.+)/)
        message.edit(
            `\`\`\`css\n> ${arr[0]}\`\`\`${arr[1]}`
        );
    },

    'shrug': (message, _, msg) => {
        message.edit(msg + "¯\\_(ツ)_\/¯");
    },

    'hideyourshame': (message, config, msg, n=0) => {
        msg = msg.slice(n.length + 1),
        n   = parseInt(n) + 1;

        message.channel.fetchMessages( {limit: 99} )
            .then((messages) => {
                messages.array()
                    .filter(m => m.author.id === config.soupmaster)
                    .slice(0,n)
                    .forEach(message => message.delete());
            });
    }
}
