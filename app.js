const express = require('express');
const jwt = require('jsonwebtoken');
const PORT = 5000;

const app = new express();

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'admin',
        email: 'admin@gmail.com'
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({ token });
        }
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
