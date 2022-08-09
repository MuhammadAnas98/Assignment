const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = require("../src/constants");

function validateToken(req, res) {
    const authHeader = req.headers["authorization"];

    const token = authHeader?.split(" ")[1];
//the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present");
    jwt.verify(token, `${ACCESS_TOKEN_SECRET}`, (err, payload) => {
        if (err) {
            res.status(403).send("Token invalid");
        }
        req.organizationId = payload?.us;
    })
}

function generateAccessToken() {
    return jwt.sign({ us : 122 } , `${ACCESS_TOKEN_SECRET}`, {expiresIn: "15m"});
}

module.exports = {
    validateToken,
    generateAccessToken,
}