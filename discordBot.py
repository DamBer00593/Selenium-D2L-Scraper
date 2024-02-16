import discordClass
import configFile
import asyncio


async def main():
    await bot.sendMessage()

bot = discordClass.discordClass(configFile.DISCORDSECRET)
asyncio.run(main())
