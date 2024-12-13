const Avi = require('../models/avisos');

exports.getAllAvisos = async (req, res) => {
  try {
      const avisos = await Avi.find();
      res.json(avisos.map(aviso => aviso.showData()));
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.createAviso = async (req, res) => {
  const aviso = new Avi({
    avi_name: req.body.avi_name,
    avi_description: req.body.avi_description
  });

  try {
      const newAviso = await aviso.save();
      res.status(201).json(newAviso.showData());
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

exports.getAvisoById = async (req, res) => {
  try {
      const aviso = await Avi.findById(req.params.id);
      if (!aviso) return res.status(404).json({ message: 'Aviso no encontrado' });

      res.json(aviso.showData());
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.updateAvisoById = async (req, res) => {
  try {
    const aviso = await Avi.findById(req.params.id);
    if (!aviso) return res.status(404).json({ message: 'Aviso no encontrado' });

    const { avi_name, avi_description } = req.body;
    if (avi_name) aviso.avi_name = avi_name;
    if (avi_description) aviso.avi_description = avi_description;

    const updatedAviso = await aviso.save();
    res.status(200).json({
      message: 'Aviso actualizado exitosamente',
      aviso: updatedAviso.showData(),
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error actualizando el aviso',
      details: err.message,
    });
  }
};

exports.deleteAvisoById = async (req, res) => {
  const { id } = req.params;

  try {
    const aviso = await Avi.findByIdAndDelete(id);

    if (!aviso) {
      return res.status(404).json({
        success: false,
        message: 'Aviso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Aviso eliminado exitosamente',
      data: aviso, 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando el aviso',
      error: err.message,
    });
  }
};


