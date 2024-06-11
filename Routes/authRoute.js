const router = require("express").Router();
const creatErrors = require("http-errors");
const { registerSchema, authschema } = require("../helper/validator_schema");
const pool = require('../db');
const { signacessToken } = require("../helper/jwt_helper");


router.post("/register", async (req, res) => {
    try {
        const user_data = await registerSchema.validateAsync(req.body);
        const doexist = await pool.query("SELECT EXISTS (SELECT 1  FROM signup WHERE  email = $1 )", [user_data.email]);
        if (doexist.rows.exists) {
            throw creatErrors.Conflict(`${user_data.email} already exist !`)

        }
        else {
            const saved_data = await pool.query(`INSERT INTO signup (name, email, password) VALUES ('${user_data.name}', '${user_data.email}', crypt('${user_data.password}',gen_salt('bf'))) RETURNING *`);
            console.log(saved_data)
            const accesstoken = await signacessToken(saved_data.rows[0].user_id);
            res.json({ status: true, accesstoken })
        }


    } catch (error) {
        if (error.constraint === "signup_email_key") {
            res.json({ message: "email already exist !" })
        } else {
            console.error(error)
            res.json(error)
        }

    }

})


router.post("/login", async (req, res) => {
    const data_for_login = await authschema.validateAsync(req.body);
    const doexist = await pool.query("SELECT EXISTS (SELECT 1 FROM signup WHERE email = $1)", [data_for_login.email]);
    console.log(doexist)
    if (!doexist.rows[0].exists) {
        throw creatErrors.Conflict(`${data_for_login.email} not found !`)
    } else {
        const saved_hased_password = await pool.query(`SELECT password FROM signup WHERE email = $1`, [data_for_login.email]);
        const hashed_password_from_db = saved_hased_password.rows[0].password;
        const match_password = await pool.query(`SELECT * FROM signup WHERE email = $1 AND password = crypt($2, $3)`, [data_for_login.email, data_for_login.password, hashed_password_from_db]);
        if (match_password.rows.length === 0) {
            throw creatErrors.Conflict("email or password error !")
        } else {
            const user_id = match_password.rows[0].user_id;
            const accesstoken = await signacessToken(user_id);
            res.json({ status: true, accesstoken })
        }
    }
})


module.exports = router;