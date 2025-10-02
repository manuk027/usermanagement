export const checkSession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}

export const isLogin = (req, res, next) => {
    if (req.session.user) {
        console.log(req.session.user)
        res.redirect('/user/home')
    } else {
        next();
    }
    console.log(req.session.user)
}