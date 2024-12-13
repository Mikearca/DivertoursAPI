const express = require('express');
const router = express.Router();
const commentController = require('../contollers/comm-controller');

router.get('/comments', commentController.getAllComments);
router.post('/comments', commentController.createComment);
router.get('/comments/:id', commentController.getCommentById);
router.put('/comments/:id', commentController.updateCommentById);
router.delete('/comments/:id', commentController.deleteCommentById);

module.exports = router;
