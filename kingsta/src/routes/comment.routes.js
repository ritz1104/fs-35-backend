import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { createComments, deleteComment, getComments, likeComment, updateComment } from '../controllers/comment.controller.js'

const router = express.Router()


router.post('/create',authMiddleware,createComments)
router.patch('/update/:id',authMiddleware,updateComment)
router.delete('/delete/:id',authMiddleware,deleteComment)
router.patch('/like/:id',authMiddleware,likeComment)
router.get('/:id',authMiddleware,getComments)

export default router