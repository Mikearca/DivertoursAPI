const iti = require('../models/iti');
const User = require('../models/users')

// CREAR UN ITINERARIO
exports.createIti = async (req, res) => {
  try {
    // Verificar si ya hay un itinerario activo
    const existingIti = await iti.findOne({});
    if (existingIti) {
      return res.status(400).json({ message: "Ya existe un itinerario activo. No se puede crear otro." });
    }

    const itinerario = new iti({
      iti_name: req.body.iti_name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    });

    const newIti = await itinerario.save();
    res.status(200).json({
      message: 'Itinerario creado exitosamente',
      data: newIti.showData()
    });
  } catch (err) {
    res.status(400).json({ message: "Error al crear el itinerario", error: err.message });
  }
};

// ELIMINAR UN ITINERARIO
exports.deleteIti = async (req, res) => {
  try {
    const itinerario = await iti.findById(req.params.id);
    if (!itinerario) return res.status(404).json({ message: 'Itinerario no encontrado' });

    await itinerario.remove();
    res.json({ message: 'Itinerario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER TODOS LOS ITINERARIOS DE LA COLECCIÓN
exports.getAllIti = async (req, res) => {
  try {
    const itinerarios = await iti.find();
    res.json(itinerarios.map(iti => iti.showData()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OBTENER UN ITINERARIO POR ID Y VERIFICAR SI ESTÁ ACTIVO
exports.getItiById = async (req, res) => {
  try {
    const itinerario = await iti.findOne({ iti_id: req.params.id });
    if (!itinerario) return res.status(404).json({ message: 'Itinerario no encontrado' });

    const today = new Date();
    if (today > new Date(itinerario.end_date)) {
      return res.status(400).json({ message: 'El itinerario ha caducado' });
    }

    res.json(itinerario.showData());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearAllItineraries = async (req, res) => {
  try {
    const result = await iti.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No hay itinerarios para eliminar." });
    }
    res.status(200).json({
      message: `Se eliminaron ${result.deletedCount} itinerario(s) de la colección.`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error al limpiar la colección de itinerarios", error: err.message });
  }
};

exports.enrollUserToItinerary = async (req, res) => {
  try {
      const { userId } = req.body;
      const iti_id = req.params.id;

      if (!userId || !iti_id) {
          return res.status(400).json({ success: false, message: 'Datos incompletos.' });
      }

      const itinerary = await iti.findOne({ iti_id });
      if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerario no encontrado.' });

      // Cambiar el rol del usuario
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });

      user.rol = 'traveler';
      await user.save();

      res.status(200).json({ success: true, message: 'Usuario inscrito exitosamente.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
};


