import express from "express"

import {
    registerUser, 
    authenticateUser,
    confirmUser,
    recoverPassword,
    checkToken,
    createNewPassword,
    getUserProfile
} from "../controllers/userController.js"
import checkAuth from "../middleware/checkAuth.js"

const router =express.Router()

// users Authentication, Registration and Confirmation 
router.post('/', registerUser)
router.post('/login', authenticateUser)
router.get('/confirm/:token', confirmUser)
router.post('/recover_password', recoverPassword)
router.route('/recover_password/:token').get(checkToken).post(createNewPassword)
router.get('/profile', checkAuth, getUserProfile)

export default router