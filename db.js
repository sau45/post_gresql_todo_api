const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

pool.connect((err) => {
    try {
        if (err) throw err;
        console.log("Connect Postgresql Successfully !");

    } catch (error) {

    }

})

module.exports = pool;
