import { Router } from "express";
import * as comentarioCtrl from '../controllers/comentario.controller'
import { updatePost } from "../controllers/post.controller";
const router = Router();
require('dotenv').config();

router.post('/', comentarioCtrl.newComment);

router.put('/', comentarioCtrl.updateComment);

router.delete('/', comentarioCtrl.deleteComment);

export default router;