export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.context.role !== role)
            return res.status(403).json({error: "Forbidden"});

        next();
    };
};