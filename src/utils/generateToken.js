const jwt = require('jsonwebtoken');

const generateToken = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
            if (error) {
                console.error(error);
                reject('Token generation failed');
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = generateToken;
