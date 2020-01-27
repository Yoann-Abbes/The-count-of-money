const jwt = require('jsonwebtoken');

module.exports = {
    isAuthorized: function(req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            // Token recovering and parse out the header
            let token = req.headers.authorization.split(" ")[1];
            
            // JSON Web Token validation
            jwt.verify(token, process.env.JWT_KEY , {algorithm: "HS256"}, (err, client) => {
                if (err) {
                    // In case of an error, the user is not authorized
                    res.status(500).json({error: "Not Authorized"});
                    throw new Error("Not Authorized");
                }
    
                return next();
            });
        } else {
            // Not authorization header exists
            res.status(500).json({error: "Not Authorization header exists"});
            throw new Error("Not Authorization header exists");
        }
    },

    idUserRecovered: function(req, res, next) {
        if (typeof req.headers.jwt !== "undefined") {
            let token = req.headers.jwt,
                decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_KEY);
            } catch (e) {
                return res.status(401).send('Unauthorized');
            }
            return decoded._id;
        } else {
            res.status(500).json({error: "Not Authorization existing"});
            throw new Error("Not Authorization existing");
        }
    },

    isAdmin: function(req, res, next) {
        if (typeof req.headers.jwt !== "undefined") {
            let token = req.headers.jwt,
                decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_KEY);
            } catch (e) {
                return res.status(401).send('Unauthorized');
            }
            if (decoded._isAdmin) { 
                return next(); 
            } else { 
                res.status(401).json({ error: "You have no right to make this action" });
            }
        } else {
            res.status(500).json({error: "Not Authorization existing"});
            throw new Error("Not Authorization existing");
        }
    }
};