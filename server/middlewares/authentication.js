const jwt = require('jsonwebtoken');

// ====================
// Token Verified
// ====================
let verifyToken = (req, res, next) => {
    
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

// ====================
// AdminRol Verified
// ====================
let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if ( user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            OK: false,
            err: {
                message: 'You are not an Administrator'
            }
        });
    } else {
        next();
    }
}

module.exports = {
    verifyToken,
    verifyAdmin
}