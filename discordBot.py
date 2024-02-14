import discordClass
import configFile
import asyncio

bot = discordClass.discordClass(configFile.DISCORDSECRET)

asyncio.run(bot.sendMessage())
