const { Router } = require('express');

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

const validateToken = require('../middlewares/validateToken');
const verifyRole = require('../middlewares/verifyRole');
const { createModerator, getModerator, getModerators, updateModerator, deleteModerator } = require('../controllers/admin.controller');
const { login, register } = require('../controllers/auth.controller');

const router = Router();

router.post('/', createUser);
router.get('/', validateToken, verifyRole('Admin', 'Moderator'), getUsers);
router.get('/:id', validateToken, getUserById);
router.put('/:id', validateToken, updateUser);
router.delete('/:id', validateToken, verifyRole('Admin'), deleteUser);

// Moderators
router.get('/moderator/:id', validateToken, getModerator, verifyRole('Admin'))
router.get('/moderators', validateToken, getModerators, verifyRole('Admin'))
router.post('/moderator', validateToken, createModerator, verifyRole('Admin'))
router.patch('/moderator', validateToken, updateModerator, verifyRole('Admin'))
router.delete('/moderator/:id', validateToken, deleteModerator, verifyRole('Admin'))

// Auth
router.post('/login', login)
router.post('/register', register)

module.exports = router;
