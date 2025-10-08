import User from '../model/userSchema.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const mail = await User.findOne({ email });
        const user = await User.findOne({ username });

        if (mail) {
            return res.render('user/register', { message: "User already exists.", layout: false });
        }
        if (user) {
            return res.render('user/register', { message: "Username is already taken", layout: false });
        }
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALTROUND));
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.render('user/login', { message: 'Registered Successfully', layout: false });
    } catch (err) {
        console.error(err);
        res.render('user/login', { message: 'Something went wrong.', layout: false });
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/user/login')
}

export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("user/login", { message: "Invalid Credentials.", layout: false, username: null });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("user/login", { message: "Invalid Credentials.", layout: false, username: null });
        }
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            blocked: user.blocked
        };
        if (user.blocked == true) {
            return res.render('user/login', { message: "User is blocked by the admin.", layout: false, username: null })
        }
        res.redirect('/user/home');
    } catch (err) {
        console.error(err);
        res.render('user/login', { message: "Something went wrong.", layout: false, username: null });
    }
};


export const loadRegister = (req, res) => {
    res.render('user/register', { message: null, layout: false });
};

export const loadLogin = (req, res) => {
    res.render('user/login', { message: null, layout: false });
};

export const loadHome = async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/user/login");
    }
    const users = await User.findById(req.session.user._id);

    if (!users || users.blocked) {
        req.session.destroy();
        return res.redirect("/user/login");
    }
    const user = req.session.user;
    res.render('user/home', { username: user.username, layout: false })
}

export const errorPage = async (req, res) => {
    res.status(404).render('404', { message: null, layout: false });
};