import mysql from "mysql2"

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

export default class DBConn {
    static getConn(hostName, dbUser, dbPassword, databaseName) {
        let con = mysql.createConnection({
            host: hostName,
            user: dbUser,
            password: dbPassword,
            database: databaseName
        });
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected")
        })
        return con;
    }
    static async openConn(con, sql) {
        return new Promise((resolve => {
            con.query(sql, function (err, result, fields) {
                try {
                    if (err) throw err;
                } catch (e) {
                    console.log(e)
                }
                resolve(result)
            })
        }), 200);
    }
}