const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get("/", userController.getAllUsers);
router.post('/add', userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
router.get("/usersByIds", userController.getUsersByIds);

module.exports = router;
