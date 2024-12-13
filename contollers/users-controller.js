const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find();  
      res.status(200).json(users);      
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Editar usuario por ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, last_name, email, password, rol } = req.body;

  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (last_name) user.last_name = last_name;
      if (email) user.email = email;
      
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
      }

      if (rol) user.rol = rol;

      await user.save(); 

      res.status(200).json({
          message: 'User updated successfully'
      });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Eliminar usuario por ID
exports.deleteUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol }, 
            "1234",
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.status(200).json({
            userId: user._id,
            email: user.email,
            rol: user.rol  
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Buscar usuarios por nombre
exports.searchUsersByName = async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Logout
exports.logout = async (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    return res.sendStatus(200);
};

// Registro
exports.register = async (req, res) => {
    const { email, password, name, last_name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            last_name,
            email,
            password: hashedPassword,
            rol: 'user' 
        });

        await newUser.save();
        res.json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//RESETEO DE ROLES A USER
exports.assignUserRoleToNonAdmins = async (req, res) => {
    try {
      const result = await User.updateMany(
        { rol: { $ne: 'admin' } }, 
        { $set: { rol: 'user' } } 
      );
  
      if (result.nModified > 0) {
        res.status(200).json({ message: 'Roles updated successfully', updatedCount: result.nModified });
      } else {
        res.status(404).json({ message: 'El viaje ha sido finalizado' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
