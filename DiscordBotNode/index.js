import { readFileSync } from "fs";
const configJSON = JSON.parse(readFileSync("./config.json"));

import DataA from "./DataAccessor.js"
import DC from "./DiscordClass.js"
import express from 'express'
const app = express()
const port = 3001
let discord = new DC()
app.all('*', (req, res, next) => {
    next()
})


app.get('/a', async (req, res) => {
    try {
        let message = "hi lol"
        discord.editMessageByID(message, configJSON.channelID, configJSON.messageID)
        res.status(200).send("")
    }
    catch (e) {
        console.log(e)
        res.send("ERROR")
    }
})

app.post('/bulkAssignments', (req, res) => {
    res.status(404)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    // Log in to Discord with your client's token
    discord.startBot(configJSON.discordSecret)
})