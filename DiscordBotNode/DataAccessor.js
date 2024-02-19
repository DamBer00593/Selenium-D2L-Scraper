// import { databaseHOST, databaseUser, databasePass } from './config.json' assert { type: `json` };

import { readFileSync } from "fs";
const configJSON = JSON.parse(readFileSync("./config.json"));

import DBConn from "./DBConn.js";
export default class DataAccessor {
    static con = DBConn.getConn(configJSON.databaseHOST, configJSON.databaseUser, configJSON.databasePass, configJSON.databaseName)
    static thisisafunction() {
        return "hello"
    }

    static async addAssignment(assignmentName, d2lCourseCode, nbccCourseCode, unixtime) {
        queryString = `insert into assignments (assignmentName, d2lCourseCode, nbccCourseCode, unixtime) values ("${assignmentName}",${d2lCourseCode},"${nbccCourseCode}",FROM_UNIXTIME(${unixtime})`
        let response = await DBConn.openConn(this.con, queryString)
        return response
    }

    static async getAssignments(assignmentName, d2lCourseCode, nbccCourseCode, unixtime) {
        queryString = `select assignmentName, d2lCourseCode, nbccCourseCode, UNIX_TIMESTAMP(unixtime) from assignments`
        let response = await DBConn.openConn(this.con, queryString)
        return response
    }
}