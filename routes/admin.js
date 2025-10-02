import express from 'express';
import { loadLogin, adminLogin, loadDashboard, errorPage, addUser, postUser, viewUser, editUser, editUserPost, deleteUser, searchUsers, blockUser, adminLogout} from '../controller/adminController.js';
import { checkSession, isLogin } from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/login', isLogin, loadLogin);
adminRouter.get('/dashboard', checkSession, loadDashboard);
adminRouter.get('/logout', checkSession, adminLogout)
adminRouter.get('/add', checkSession, addUser);
adminRouter.get('/view/:id', checkSession, viewUser);
adminRouter.get('/edit/:id', checkSession, editUser);

adminRouter.post('/login', adminLogin);
adminRouter.post('/add', checkSession, postUser);
adminRouter.post('/search', searchUsers);
adminRouter.post('/block/:id', blockUser);

adminRouter.put('/edit/:id', checkSession, editUserPost);
adminRouter.delete('/edit/:id', checkSession, deleteUser);

adminRouter.use(errorPage);
export { adminRouter };
