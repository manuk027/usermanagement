import express from 'express';
import { loadLogin, loadHome, errorPage, logout, loginUser, registerUser, loadRegister } from '../controller/userController.js';
import { isLogin, checkSession } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.get('/register', isLogin, loadRegister);
userRouter.get('/login', isLogin, loadLogin);
userRouter.get('/home', checkSession, loadHome);
userRouter.get('/logout', checkSession, logout)

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.use(errorPage);

export { userRouter };