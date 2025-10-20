const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 2. Check if it's a Bearer token
  const token = authHeader.split(' ')[1]; // "Bearer TOKEN_STRING"
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token.' });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Add the user's ID to the request object
    req.user = decoded; // { id: '...', username: '...' }
    next(); // Let the request continue to the route
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;