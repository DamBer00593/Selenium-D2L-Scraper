import { Client, Events, GatewayIntentBits } from 'discord.js'
export default class DiscordClass {
    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    startBot(discordSecret) {
        this.client.login(discordSecret)
        this.client.once(Events.ClientReady, readyClient => {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    }

    sendMessage(channelID, messageContent) {
        this.client.channels.cache.get(channelID).send(messageContent)
    }

    async editMessageByID(editedContent, channelID, messageID) {
        const channel = this.getChannel(channelID)
        const message = await this.getMessage(channel, messageID)
        message.edit(editedContent)
    }

    getChannel(channelID) {
        return this.client.channels.cache.get(channelID)
    }

    async getMessage(channel, messageID) {
        return await channel.messages.fetch(messageID)
    }

}