const Comment = require('../models/comment');
const User = require('../models/users');  // Para hacer referencia a los usuarios

exports.createComment = async (req, res) => {
  const { userId, comment, rating } = req.body; 
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      user: userId,
      comment: comment,
      rating: rating || null 
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment created', comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener todos los comentarios
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'name email'); 
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un comentario por ID
exports.getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id).populate('user', 'name email');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un comentario por ID
exports.updateCommentById = async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  try {
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment) existingComment.comment = comment;
    if (rating) existingComment.rating = rating;

    await existingComment.save();
    res.status(200).json({
      message: 'Comment updated successfully',
      comment: existingComment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un comentario por ID
exports.deleteCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.remove();  
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
