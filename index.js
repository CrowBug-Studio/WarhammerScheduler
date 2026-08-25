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
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
    rest: {timeout:15000}
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageReactionAdd", async (reaction, user) => { //When a reaction is added
    if (user.bot) return; //If the reaction is from a bot don't count it

    try {
        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();
    } catch (error) {
        console.error("Failed to get partial, ", error);
        return;
    }

    console.log(`Reaction from ${user.tag} on ${reaction.message.id}`);

    try { //Send the information to HTTP
        await axios.post(process.env.PIPEDREAM_WEBHOOK_URL, {
            guild_id: reaction.message.guildId,
            channel_id: reaction.message.channelId,
            message_id: reaction.message.id,
            user_id: user.id,
            emoji: reaction.emoji.name
        });
        console.log("Payload Sent")
    } catch (error) {
        console.error("HTTP Failed", error.message);
    }
});

//Remove the 7 lines below this after testing
console.log(`Node: ${process.version}`);
console.log("Checking environment variables...");
console.log("Token length:", process.env.DISCORD_BOT_TOKEN ? process.env.DISCORD_BOT_TOKEN.length : "MISSING/UNDEFINED");
console.log("Pipedream URL defined:", Boolean(process.env.PIPEDREAM_WEBHOOK_URL));
client.on("debug", (info) => console.log(`[DEBUG] ${info}`));
client.on("warn", (info) => console.warn(`[WARN] ${info}`));
client.on("error", (error) => console.error(`[ERROR]`, error));

client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
    console.error("Login error: ", err.message);
});