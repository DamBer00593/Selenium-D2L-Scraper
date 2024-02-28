import { readFileSync } from "fs";
const configJSON = JSON.parse(readFileSync("./config.json"));

import DataA from "./DataAccessor.js"
import DC from "./DiscordClass.js"
import express, { json } from "express"
// import moment from 'moment'
// import fs from 'fs'
// let logStream = fs.createWriteStream('log.txt')
// let console = {}
// console.log = (obj) => {
//     var s = ''
//     if (typeof obj === 'string')
//         s = obj
//     else
//         s = JSON.stringify(obj)

//     var dS = '[' + moment().format() + '] '
//     s = `[${dS}] ${s}'\n'`
//     logStream.write(s)
// }
const app = express()
app.use(express.json());
const port = 3001

let discord = new DC()
app.all('*', (req, res, next) => {
    console.log("am i doing something?")
    next()
})


app.get('/a', async (req, res) => {
    try {
        let message = "hi lol"
        discord.sendMessage(configJSON.channelID, message)
        res.status(200).send("")
        console.log("/a")
    }
    catch (e) {
        console.log(e)
        res.send("ERROR")
    }
})

app.get('/courses', async (req, res) => {
    try {
        let resp = await DataA.getCourses()
        res.status(200).json(JSON.parse(resp))

    } catch (e) {
        console.log(e)
    }

})


app.get('/assignments/due', async (req, res) => {
    try {
        let resp = await DataA.getAssignmentsDue()
        res.status(200).json(JSON.parse(resp))
    } catch (e) {
        console.log(e)
    }

})

app.get('/assignments', async (req, res) => {
    try {
        let resp = await DataA.getAssignments()
        res.status(200).json(JSON.parse(resp))
    } catch (e) {
        console.log(e)
    }

})



app.post('/bulkAssignments', async (req, res) => {
    try {
        let body = req.body.assignments
        console.log(body.length)
        for (let i = 0; i < body.length; i++) {
            console.log(body[i])
            await DataA.addAssignment(body[i].assessmentName, body[i].courseCode, body[i].unixTimestamp)
        }
        res.status(200).send(`Successfully added`)
    } catch (e) {
        console.log(e)
    }

})

app.post('/bulkCourses', async (req, res) => {
    try {
        let body = req.body.courses
        console.log(body.length)
        for (let i = 0; i < body.length; i++) {
            console.log(body[i])
            await DataA.addCourse(body[i].courseCode, body[i].courseName)

        }
        await editDiscordMessage()
        res.status(200).send(`Successfully added`)
    } catch (e) {
        console.log(e)
    }

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