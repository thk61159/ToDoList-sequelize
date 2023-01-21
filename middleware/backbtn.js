module.exports = {
  backbtn: (req, res, next) => {
    res.locals.controller = '/';
    res.locals.sign = 'back';
    next();
  },
};
