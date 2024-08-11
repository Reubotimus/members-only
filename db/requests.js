const pool = require("./pool");

async function addUser(username, password) {
    try {
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
    } catch(err) {
        console.error("error adding user", err)
    }
}

async function addMessage(userId, message) {
    try {
        await pool.query('INSERT INTO messages (userid, message, time) VALUES ($1, $2, NOW())', [userId, message]);
    } catch(err) {
        console.error("error adding message", err)
    }
}

async function obtainUserWithId(userId) {
    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (rows.length == 0) {
            return undefined;
        }
        return rows[0]
    } catch(err) {
        console.error("error finding user", err);
        return undefined;
    }
}

async function obtainUserWithUsername(username) {
    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length == 0) {
            return undefined;
        }
        return rows[0]
    } catch(err) {
        console.error("error finding user", err);
    }
}

async function giveMemberPermission(userId) {
    try {
        await pool.query('UPDATE users SET member = TRUE WHERE id = $1', [userId]);
    } catch(err) {
        console.error("error giving user member permission", err);
    }
}

module.exports = {giveMemberPermission, addUser, addMessage, obtainUserWithId, obtainUserWithUsername};
