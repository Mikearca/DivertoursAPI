const express = require('express');
const router = express.Router();
const { register, login, logout, getAllUsers, updateUserById, getUserById, deleteUserById, searchUsersByName, assignUserRoleToNonAdmins } = require('../contollers/users-controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserById); 
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUserById);
router.get('/buscar', searchUsersByName);
router.put('/asign', assignUserRoleToNonAdmins);

module.exports = router;