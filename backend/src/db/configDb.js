import mysql2 from "mysql2"

const pool = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'manager',
    database:'docter_appointment_db'
})

export default pool