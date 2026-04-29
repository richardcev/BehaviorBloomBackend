const express = require('express');
const {
  processApplication,
  getAllCandidates,
  getCandidateById
} = require('../controllers/recruitmentController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "example@gmail.com"
 *         hasRBT:
 *           type: string
 *           example: "yes"
 */

/**
 * @swagger
 * /api/recruitment:
 *   get:
 *     summary: Obtiene la lista de todos los candidatos
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 15
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Token invalido, expirado o ausente
 *       403:
 *         description: Usuario inactivo
 */
router.get('/', authenticate, getAllCandidates);

/**
 * @swagger
 * /api/recruitment/{id}:
 *   get:
 *     summary: Obtiene los detalles de un candidato especifico
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Detalles del candidato
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: Token invalido, expirado o ausente
 *       403:
 *         description: Usuario inactivo
 */
router.get('/:id', authenticate, getCandidateById);

/**
 * @swagger
 * /api/recruitment:
 *   post:
 *     summary: Crea un nuevo candidato y envia un correo de notificacion
 *     tags: [Recruitment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post('/', processApplication);

module.exports = router;
