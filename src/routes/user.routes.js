import { Router } from "express";
import * as userCtrl from '../controllers/user.controller'
const router = Router();

router.post('/', userCtrl.newUser);

router.get('/', userCtrl.login);

router.get('/:token', userCtrl.activate_account);

router.post('/recovery', userCtrl.recoveryPassword);

router.get('/change/:token', userCtrl.changePassword);

router.put('/newPassword', userCtrl.newPassword);

router.get('/hola/:id', userCtrl.hola)

export default router;