const jwt = require("jsonwebtoken");

const asyncHandler = require("./asyncHandler");


const auth = asyncHandler(async (req, res, next) => {

    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    // console.log("AUTH : " , req.headers);
    // if (!token) res.status(409).send("token error");

    // const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    // if (verified) {
     //   req.user_id = verified.id;
    // }
    req.user_id = "64206fd14a07c042a476aab0";
   // req.user_id = "64240cfbeba5995db52dcec2";

    return next();
}
);
module.exports = auth;