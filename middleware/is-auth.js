module.exports = function (req, res, next) {
  if (!req.session.user) {
      return res.redirect("/login");
  }
  next();
}
// module.exports = function (req, res, next) {
//     if (req.session.user.isLoggedIn) {
//         next();
//     } else {
//         return res.redirect('/login');
//     }
// }