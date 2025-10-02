import bcrypt from 'bcrypt';
import adminSchema from "../model/adminSchema.js";
import userSchema from "../model/userSchema.js";

export const loadLogin = async (req, res) => {
    res.render('admin/login', { message: null, layout: false });
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminSchema.findOne({ email });
        if (!admin) {
            return res.render('admin/login', { message: "Invalid Credentials", layout: false });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', { message: "Invalid Credentials", layout: false });
        }
        req.session.admin = {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            blocked: admin.blocked
        };
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.log(err);
        res.render('admin/login', { message: "Something went wrong", layout: false });
    }
};

export const loadDashboard = async (req, res) => {
    try {
        if (!req.session.admin) return res.redirect('/admin/login');
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const customers = await userSchema.find({}).sort({ username: 1 }).skip(perPage * (page - 1)).limit(perPage).exec();
        const count = await userSchema.countDocuments({});
        res.render('index', { customers, current: page, pages: Math.ceil(count / perPage), messages: [] });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/login');
    }
};

export const errorPage = async (req, res) => {
    res.status(404).render('404', { layout: false });
};

export const about = async (req, res) => {
    try {
        res.render("about");
    } catch (error) {
        console.log(error);
    }
};

export const addUser = async (req, res) => {
    res.render("customer/add");
};

export const postUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usernameExist = await userSchema.findOne({ email });
        const emailExist = await userSchema.findOne({ username });
        if (usernameExist) {
            return res.render('customer/add', { msg: "Username is already taken." });
        }
        if (emailExist) {
            return res.render('customer/add', { msg: "User with same email exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userSchema.create({ username, email, password: hashedPassword, });
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error);
    }
};

export const viewUser = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);
        res.render("customer/view", { user });
    } catch (error) {
        console.log(error);
    }
};

export const editUser = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);
        res.render("customer/edit", { user });
    } catch (error) {
        console.log(error);
    }
};

export const editUserPost = async (req, res) => {
    try {
        await userSchema.findByIdAndUpdate(req.params.id, { username: req.body.username, email: req.body.email });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userSchema.findByIdAndDelete(req.params.id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error);
    }
};

export const searchUsers = async (req, res) => {
    try {
        const search = req.body.search?.trim() || "";
        if (!search) {
            return res.render("search", { user: [] });
        }
        const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, "");
        const users = await userSchema.find({ $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] });
        console.log(users);
        res.render("search", { user: users });
    } catch (error) {
        console.log(error);
        res.render("search", { user: [] });
    }
};

export const blockUser = async (req, res) => {
    try {
        let block = await userSchema.findById(req.params.id, {})
        if (block.blocked) {
            await userSchema.findByIdAndUpdate(req.params.id, { blocked: false });
        } else {
            await userSchema.findByIdAndUpdate(req.params.id, { blocked: true });
        }
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error);
        res.redirect("/admin/dashboard");
    }
};


export const adminLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login')
}