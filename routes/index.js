import express from 'express';

const router_index = express.Router();

router_index.get('/', (req, res) => {
  res.render('index', { username: req.user.username });
});

export { router_index };
