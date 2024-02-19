import { readFileSync } from "fs";
const configJSON = JSON.parse(readFileSync("./config.json"));

import DataA from "./DataAccessor.js"
import DC from "./DiscordClass.js"
import express, { json } from "express"

const app = express()
app.use(express.json());
const port = 3001

let discord = new DC()
app.all('*', (req, res, next) => {
    next()
})


app.get('/a', async (req, res) => {
    try {
        let message = "hi lol"
        discord.sendMessage(configJSON.channelID, message)
        res.status(200).send("")
    }
    catch (e) {
        console.log(e)
        res.send("ERROR")
    }
})

app.get('/courses', async (req, res) => {

    let resp = await DataA.getCourses()
    res.status(200).json(JSON.parse(resp))

})


app.get('/assignments/due', async (req, res) => {

    let resp = await DataA.getAssignmentsDue()
    res.status(200).json(JSON.parse(resp))

})

app.get('/assignments', async (req, res) => {

    let resp = await DataA.getAssignments()
    res.status(200).json(JSON.parse(resp))

})



app.post('/bulkAssignments', async (req, res) => {
    let body = req.body.assignments
    console.log(body.length)
    for (let i = 0; i < body.length; i++) {
        await DataA.addAssignment(body[i].assessmentName, body[i].courseCode, body[i].unixTimestamp)
    }
    res.status(200).send(`Successfully added`)
})

app.post('/bulkCourses', async (req, res) => {
    let body = req.body.courses
    console.log(body.length)
    for (let i = 0; i < body.length; i++) {
        console.log(body[i])
        await DataA.addCourse(body[i].courseCode, body[i].courseName)

    }
    await editDiscordMessage()
    res.status(200).send(`Successfully added`)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    // Log in to Discord with your client's token
    discord.startBot(configJSON.discordSecret)
})


async function editDiscordMessage() {
    let assignments = JSON.parse(await DataA.getAssignmentsDue())
    let str = ""
    for (let i = 0; i < assignments.length; i++) {
        // console.log(assignments[i])
        str += `${assignments[i].nbccCourseCode}, ${assignments[i].assignmentName} due <t:${assignments[i].unixtime}:F> <t:${assignments[i].unixtime}:R>\n`
    }
    discord.editMessageByID(str, configJSON.channelID, configJSON.messageID)
}