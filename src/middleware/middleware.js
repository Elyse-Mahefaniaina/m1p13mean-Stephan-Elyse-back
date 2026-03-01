const { validateToken } = require('../config/jwtUtils');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(403).json({message: "veuillez vous authentifier !", isAuthError: true});

    try {
        const decoded = validateToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Token invalide ou expiré",
            isAuthError: true
        });
    }
};

module.exports = authenticateToken;
