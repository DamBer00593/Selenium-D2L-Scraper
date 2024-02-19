import { Client, Events, GatewayIntentBits } from 'discord.js'

import moment from 'moment'
import fs from 'fs'
let logStream = fs.createWriteStream('log.txt')
let console = {}
console.log = (obj) => {
    var s = ''
    if (typeof obj === 'string')
        s = obj
    else
        s = JSON.stringify(obj)

    var dS = '[' + moment().format() + '] '
    s = `[${dS}] ${s}'\n'`
    logStream.write(s)
}

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