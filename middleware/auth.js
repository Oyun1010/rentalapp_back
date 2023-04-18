const jwt = require("jsonwebtoken");
require('dotenv').config();

const auth = (req, res, next) => {
    // const token = req.headers['Authorization'];
    const token = req.headers["x-access-token"];
    console.log("AUTH TOKEN: ", token);
 
    // if (!token) return res.status(401).json({ message: "Unauthorized User" });

    try {
        // const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        // let verified = jwt.verify(token, process.env.TOKEN_SECRET);
      
        // let id = "64240cfbeba5995db52dcec2"
        // renter id = "64240cfbeba5995db52dcec2"
        // owner id = "64206fd14a07c042a476aab0"
        req.user_id = "64206fd14a07c042a476aab0";
        return next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized User" })
    }
}
module.exports = auth;