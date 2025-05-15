const express = require('express');
const Blogpost = require('../schema/blogpost');
const createError = require('http-errors');

const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'your-secret-key';

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
    console.log('user', user);

        if (err) {
            return res.sendStatus(403); // Forbidden (invalid token)
        }
        req.user = user;
        next();
    });
};

router.post('/', authenticateUser, async (req, res) => {
    const { title, content, tags, category } = req.body;
    try {
        await Blogpost.create({
            title,
            content,
            tags,
            category,
            author: req.user.userId
        });
        res.send(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Blogpost.findOne({ _id: id });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', authenticateUser, async (req, res, next) => {
    try {
        const items = await Blogpost.find();
        res.json(items);
    } catch (err) {
        next(createError(500, err.message));
    }
});


router.put('/:id', authenticateUser, async (req, res, next) => {
    const { title, content, tags, category, isPublished } = req.body;
    const { id } = req.params;
    try {
        await Blogpost.updateOne({ _id: id }, { title, content, tags, category, isPublished, publishDate: Date.now() });
        res.sendStatus(200);
    } catch (err) {
        next(createError(500, err.message));
    }
});


router.delete('/:id', authenticateUser, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Blogpost.deleteOne({ _id: id});
    res.sendStatus(200);
  } catch (err) {
    next(createError(500, err.message));
  }
});

module.exports = router;