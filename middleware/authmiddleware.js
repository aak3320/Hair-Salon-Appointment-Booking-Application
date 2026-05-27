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

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Invalid token format."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = verifyToken;
