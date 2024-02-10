# bot.py

import discord


client = discord.Client(intents=discord.Intents.default())


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')
    # user = await client.fetch_user(264611774127538177)
    # await user.send("hello")
    channel = await client.fetch_channel(937749897459957770)
    message = await channel.send("asd")
    messageid = message.id
    print(messageid)

    message2 = await channel.fetch_message(1205664798436491284)
    print(message2.content)
    await message2.delete()

client.run(
    "MTAyNDA4MDA0OTUyMTA0NTUxNA.GEoW1K.HYTp_CsDwgRS9atw-VEVMVt7sBDL7gw5UcFiFc")
