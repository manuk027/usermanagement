export const checkSession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}

export const isLogin = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/user/home')
    } else {
        next();
    }
}