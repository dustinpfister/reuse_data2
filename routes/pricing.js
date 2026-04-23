import express from 'express';

const router_pricing = express.Router();

router_pricing.get('/pricing', (req, res) => {
  res.render('pricing', { 
    username: req.user.username
  });
});

export { router_pricing };
