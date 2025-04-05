import jwt from 'jsonwebtoken';


// const jwt = require('jsonwebtoken');
const SECRET = 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach the decoded user object to request
    next();
  });
};

 
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
  
      next();
    };
  };
  
 export const debugToken = (req, res, next) => {
    console.log('Token payload:', req.user);
    next();
  };
  

export const sanitizeUserData = (req, res, next) => {
    if (req.user) {
      delete req.user.password;
      delete req.user.sensitiveField;
    }
    next();
  };
  