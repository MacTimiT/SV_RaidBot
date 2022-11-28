const Discord = require("discord.js");
const TOKEN = require("./token.json").token

const client = new Discord.Client({
    intents:[
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ],
});

let bot = {
    client,
    prefix: "n.",
    owners: ["297651949422247937"]
}

const guildId = "1043880586483355759"

client.slashcommands = new Discord.Collection()

client.loadSlashCommands = (bot, reload) => require("./handlers/slashCommands")(bot, reload)
client.loadSlashCommands(bot, false)

client.on("ready", async () => {
    const guild = client.guilds.cache.get(guildId)
    if (!guild)
        return console.error("Target guild not found")
    
    await guild.commands.set([...client.slashcommands.values()])
    console.log(`Successfully loaded in ${client.slashcommands.size}`)
    process.exit(0)
})

module.exports = bot

client.login(TOKEN);