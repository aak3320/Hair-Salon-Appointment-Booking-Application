const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized...Please login first'
            });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];

        // Verification of token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        // Attach decoded user data to request so they can use in next function
        req.user = decoded;

        next();

    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Not authorized...Please login first'
        });
    }
};

module.exports = { protect };
