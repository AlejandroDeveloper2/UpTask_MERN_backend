import express from 'express'

import checkAuth from '../middleware/checkAuth.js'

import { 
    addTask,
    getTask,
    editTask,
    deleteTask,
    changeTaskStatus
}from '../controllers/taskController.js'

const router=express.Router()

router.post('/', checkAuth,addTask)
router.route('/:id')
    .get(checkAuth,  getTask)
    .put(checkAuth,  editTask)
    .delete(checkAuth, deleteTask)
router.post('/status/:id', checkAuth, changeTaskStatus)

export default router