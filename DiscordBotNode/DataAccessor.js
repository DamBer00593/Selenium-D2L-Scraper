// import { databaseHOST, databaseUser, databasePass } from './config.json' assert { type: `json` };

import { readFileSync } from "fs";
const configJSON = JSON.parse(readFileSync("./config.json"));

import DBConn from "./DBConn.js";
import { createCipheriv } from "crypto";
export default class DataAccessor {
    static con = DBConn.getConn(configJSON.databaseHOST, configJSON.databaseUser, configJSON.databasePass, configJSON.databaseName)
    static thisisafunction() {
        return "hello"
    }

    static async addAssignment(assignmentName, d2lCourseCode, unixtime) {
        let queryString = `insert into assignments (assignmentName, d2lCourseCode, unixtime) values ("${assignmentName}",${d2lCourseCode},FROM_UNIXTIME(${unixtime}))`
        let response = await DBConn.openConn(this.con, queryString)
        return response
    }

    static async getAssignments(assignmentName, d2lCourseCode, nbccCourseCode, unixtime) {
        let queryString = `select assignmentName, d2lCourseCode, nbccCourseCode, UNIX_TIMESTAMP(unixtime) from assignments`
        let response = await DBConn.openConn(this.con, queryString)
        return response
    }

    static async addCourse(d2lCourseCode, nbccCourseCode) {
        let queryString = `insert into courses (d2lCourseCode, nbccCourseCode) values (${d2lCourseCode},"${nbccCourseCode}")`
        let response = await DBConn.openConn(this.con, queryString)
        return response


    }

    static async getCourses() {
        let response = await DBConn.openConn(this.con, `select * from courses`)
        let json = JSON.stringify(response)
        return json
    }

    static async getAssignments() {
        let response = await DBConn.openConn(this.con, `select assignmentName, d2lCourseCode, UNIX_TIMESTAMP(unixtime) as unixtime from assignments;`)
        let json = JSON.stringify(response)
        return json
    }

    static async getAssignmentsDue() {
        let response = await DBConn.openConn(this.con, `select assignmentName, c.nbccCourseCode, UNIX_TIMESTAMP(unixtime) as unixtime from assignments a inner join courses c on c.d2lCourseCode = a.d2lCourseCode where unixtime > DATE_SUB(CURDATE(), INTERVAL 2 DAY) order by unixtime`)
        let json = JSON.stringify(response)
        return json
    }

}

