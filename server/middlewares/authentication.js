const jwt = require('jsonwebtoken');

// Token verify
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid.'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

// Admin or super users verify
let verifyAdminSuperUser = (req, res, next) => {
    let user = req.user;
    if (!(user.role === 'ADMIN_ROLE' || user.role === 'SUPER_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not authorized to create users.'
            }
        });
    }
    next();
};

// Verify token at URL
let verifyTokenPictureUrl = (req, res, next) => {
    let token = req.query.Authorization;

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid.'
                }
            });
        }

        req.user = decoded.user;
        next();
    });

};

module.exports = { verifyToken, verifyAdminSuperUser, verifyTokenPictureUrl }