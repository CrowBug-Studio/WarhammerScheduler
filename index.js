const http = require("http"); //HTTP requirement
const {Client, GatewayIntentBits, Partials} = require("discord.js"); //Get the requirements
const axios = require("axios"); //Get the HTTP service

//Create a HTTP server so Render stays on
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Online");
}).listen(PORT, () => {
    console.log(`Server active on ${PORT}`);
});

const client = new Client({ 
    intents: [ //Get the specific discord permission
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User] //Allows for viewing new messages after the bot starts
});

client.on("messageReactionAdd", async (reaction, user) => { //When a reaction is added
    if (user.bot) return; //If the reaction is from a bot don't count it

    if (reaction.partial) { //Uncached data
        try {
            await reaction.fetch();
        } catch (error) {
            console.error("Failed to get message data", error);
            return;
        }
    }

    try { //Send the information to HTTP
        await axios.post(process.env.PIPEDREAM_WEBHOOK_URL, {
            guild_id: reaction.message.guildId,
            channel_id: reaction.message.channelId,
            message_id: reaction.message.id,
            user_id: user.id,
            emoji: reaction.emoji.name
        });
    } catch (error) {
        console.error("HTTP Failed", error.message);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);