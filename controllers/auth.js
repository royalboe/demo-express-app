exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').trim().split('=')[1];
  console.log(isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'isLoggedIn=true; HttpOnly')
  // req.isLoggedIn = true;
  res.redirect('/login');
}