const Candidate = require('../models/Candidate');
const { sendApplicationEmail } = require('../utils/email');

const processApplication = async (req, res) => {
  const payload = req.body;

  try {
    // 1. Guardar en Base de Datos
    const savedCandidate = await Candidate.create(payload);
    console.log(`👤 Candidato guardado en BD con ID: ${savedCandidate.id}`);

    // 2. Enviar Correo
    await sendApplicationEmail(payload);

    res.status(200).json({ message: 'Application processed successfully!' });
  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
};

// ==========================================
// GET: Obtener TODOS los candidatos
// ==========================================
const getAllCandidates = async (req, res) => {
  try {
    // findAll() trae todos los registros. Usamos 'order' para que los más nuevos salgan primero.
    const candidates = await Candidate.findAll({
      order: [['createdAt', 'DESC']] 
    });
    
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    res.status(500).json({ error: 'Error al obtener la lista de candidatos' });
  }
};

// ==========================================
// GET: Obtener UN SOLO candidato por ID
// ==========================================
const getCandidateById = async (req, res) => {
  const { id } = req.params; // Extraemos el ID de la URL

  try {
    // findByPk busca por Primary Key (el ID)
    const candidate = await Candidate.findByPk(id);

    // Si no encuentra al candidato, devolvemos un error 404 (Not Found)
    if (!candidate) {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error(`Error al obtener el candidato con ID ${id}:`, error);
    res.status(500).json({ error: 'Error al obtener los detalles del candidato' });
  }
};

// Exportamos todas las funciones
module.exports = { 
  processApplication, 
  getAllCandidates, 
  getCandidateById 
};