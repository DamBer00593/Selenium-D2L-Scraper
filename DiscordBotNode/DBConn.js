import mysql from "mysql2"
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