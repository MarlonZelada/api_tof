import { Router } from "express";
import * as userCtrl from '../controllers/user.controller'
const router = Router();

router.post('/', userCtrl.newUser);
router.get('/', userCtrl.login);

router.put('/', userCtrl.activate_account);

export default router;