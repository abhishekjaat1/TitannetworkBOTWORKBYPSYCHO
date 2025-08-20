const { Client, GatewayIntentBits } = require("discord.js");
const util = require("minecraft-server-util");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = "!";
const serverIP = "play.mcfleet.net"; 
const serverPort = 25565;          

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "players") {
    try {
      const response = await util.status(serverIP, serverPort);

      if (response.players.sample && response.players.sample.length > 0) {
        const playerList = response.players.sample.map(p => p.name).join(", ");
        message.channel.send(`🟢 **${response.players.online}/${response.players.max}** players online:\n${playerList}`);
      } else {
        message.channel.send(`🟢 **${response.players.online}/${response.players.max}** players online.`);
      }
    } catch (error) {
      console.error(error);
      message.channel.send("❌ Failed to fetch server status. Is the server online?");
    }
  }
});

client.login(process.env.DISCORD_TOKEN); 
