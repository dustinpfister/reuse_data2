import express from 'express';

const router_settings = express.Router();

router_settings.get('/settings', (req, res) => {
  res.render('settings', { 
    username: req.user.username
  });
});

export { router_settings };
