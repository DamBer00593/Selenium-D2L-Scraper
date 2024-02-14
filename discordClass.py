# bot.py

import discord
import configFile


class discordClass:
    def __init__(self, clientSecret):
        self.client = discord.Client(intents=discord.Intents.default())
        self.client.run(clientSecret)
        print(f'{self.client.user} has connected to Discord!')

    async def sendMessage(self):
        channel = await self.client.fetch_channel(937749897459957770)
        message = await channel.send("asd")
        messageid = message.id
        print(messageid)
