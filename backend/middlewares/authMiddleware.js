const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust the path as necessary
const secret = process.env.JWT_SECRET; // Ensure this is set in your environment

const authenticate = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);
    console.log('decoded',decoded);
    req.userId = decoded?.id;
    req.role = decoded?.role;

    // Check if user exists in the database
    const user = await User.findByPk(decoded.id);


    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user information to request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
};

module.exports = authenticate;
