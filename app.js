import express from 'express';
import { configDotenv } from 'dotenv';
import { adminRouter } from './routes/admin.js';
import { userRouter } from './routes/user.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { connectDB } from './db/connectDB.js';
import session from 'express-session';
import nocache from 'nocache';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from "method-override";

configDotenv();
const app = express();

app.use(nocache());

app.use(session({
    secret: 'unique',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(methodOverride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', nocache(), userRouter);
app.use('/admin', nocache(), adminRouter);

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server runnign on http://localhost:${process.env.PORT}/user/login`)
});