const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT token from the Authorization header.
 * 
 * @function authenticateToken
 * @desc Validates JWT, attaches decoded user info to the request object, and passes control to the next middleware.
 *        Returns 401 if no token is provided, 403 if token is invalid or expired.
 * @access Protected routes only
 */
function authenticateToken(req, res, next) {
  // Extract the Authorization header (expected format: 'Bearer <token>')
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token part only

  // If no token found, deny access
  if (!token) return res.status(401).json({ message: 'Token required' });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid or expired
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Attach decoded user info to request object
    req.user = user;

    // Pass control to the next middleware/route handler
    next();
  });
}

module.exports = authenticateToken;
