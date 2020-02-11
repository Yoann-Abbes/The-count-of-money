const jwt = require('jsonwebtoken');

module.exports = {
    isAuthorized: function(req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            // Token recovering and parse out the header
            let token = req.headers.authorization;
            
            // JSON Web Token validation
            jwt.verify(token, process.env.JWT_KEY, (err, client) => {
                if (err) {
                    // In case of an error, the user is not authorized
                    res.status(500).json({error: "Not Authorized"});
                    throw new Error("Not Authorized");
                }
    
                return next();
            });
        } else {
            // No authorization header exists
            res.status(500).json({error: "Not Authorization header exists"});
            throw new Error("Not Authorization header exists");
        }
    },

    idUserRecovered: function(req, res, next) {
            let token = req.headers.authorization,
                decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_KEY);
            } catch (e) {
                return res.status(401).send('Unauthorized');
            }
            return decoded._id;
    },

    // Check if the user is an admin
    isAdmin: function(req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            let token = req.headers.authorization,
                decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_KEY);
                if (decoded._isAdmin) { 
                    return next(); 
                } else {
                    return res.status(401).send('Unauthorized');
                }
            } catch (e) {
                return res.status(401).send('Unauthorized');
            }   
        } else {
            res.status(500).json({error: "No Authorization existing"});
            throw new Error("No Authorization existing");
        }
    },

    // Check if the user is not anonymous, he can be a logged user or an admin
    isNotAnonymous: function(req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            return next();
        } else {
            return res.status(401).send('Unauthorized');
        }
    },

    // Check if the user has no already a token for login
    isAnonymous: function(req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            return res.status(401).send('Already logged');
        } else {
            return next();
        }
    }
};