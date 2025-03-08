import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user to request object
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Optional: Role-based authorization middleware
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};