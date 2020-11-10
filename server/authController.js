// require bcrypt in your authController file
const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db');
        const { email, username, password } = req.body;
        // This replaces .then and .catch and avoids callback hell
        // Normally: db.check_user(email).res...etc
        const user = await db.check_user(email);
        if(user[0]) {
            return res.status(409).send("User already exists")
        }
        // The 10 here means you add salt 10 times.
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const [newUser] = await db.add_user([username, email, hash]);
        req.session.user = {
            userId: newUser.user_id,
            email: newUser.email,
            username: newUser.username
        };
        res.status(200).send(req.session.user);
    },
    login: async (req, res) => {
        const db = req.app.get('db');
        const {email, password} = req.body;
        const user = await db.check_user(email);
        if (!user[0]){
            res.status(401).send('Incorrect credentials')
        } 
        const authenticated = bcrypt.compareSync(password, user[0].password);
        if(authenticated){
            req.session.user = {
                userId: user[0].user_id,
                email: user[0].email,
                username: user[0].username
            }
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Incorrect credentials')
        }
    },
    logout: (req, res) => {
        // Removes information from the session and ends it
        req.session.destroy();
        res.sendStatus(200)
    },
    // Is there a user object on the session? if so, grab it:
    getUser: (req, res) => {
        if(re.session.user){
            res.status(200).send(req.session.user)
        } else {
            res.sendStatus(404)
        }
    }
}