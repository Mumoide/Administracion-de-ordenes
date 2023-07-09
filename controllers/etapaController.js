const Etapas = require('../models/etapaModel');

class EtapasController {
  static getAllEtapas = async (req, res) => {
    const { id } = req.params;
    try {
      const etapas = await Etapas.getAllEtapas(id);

      if (etapas.length === 0) {
        res.status(404).json({ message: 'No se encontraron etapas' });
      } else {
        res.json({ Status: "Success", data: etapas });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;

      const etapa = await Etapas.getById(id);
      if (etapa) {
        res.json({ Status: "Success", data: etapa });
      } else {
        res.status(404).json({ message: 'Etapa no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  static createEtapa = async (req, res) => {
    try {
      const etapaData = req.body;
      await Etapas.createEtapa(etapaData);
      res.json({ Status: "Success", message: "Etapa creada exitosamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };



  static updateEtapa = async (req, res) => {
    try {
      const { id } = req.params;
      const { descripcion, fecha_entrega, fecha_envio, fecha_inicio_estado, id_estado, id_etapa, id_orden, nro_ficha } = req.body;

      const etapaData = {
        id,
        descripcion,
        fecha_entrega,
        fecha_envio,
        fecha_inicio_estado,
        id_estado,
        id_etapa,
        id_orden,
        nro_ficha
      };

      await Etapas.updateEtapa(etapaData);

      res.json({ Status: "Success", message: 'Etapa actualizada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  static updateEtapaLabo = async (req, res) => {
    try {
      const { id } = req.params;
      const { descripcion, id_estado, id_orden, nro_ficha } = req.body;

      const etapaData = {
        id,
        descripcion,
        id_estado,
        id_orden,
        nro_ficha
      };

      await Etapas.updateEtapaLabo(etapaData);

      res.json({ Status: "Success", message: 'Etapa actualizada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  static deleteEtapa = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Etapas.deleteEtapa(id);

      if (result.affectedRows === 0) {
        res.json({ message: 'Historial no encontrado.' });
      } else {
        res.json({ Status: "Success", message: 'Etapa eliminada exitosamente' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
module.exports = EtapasController;
