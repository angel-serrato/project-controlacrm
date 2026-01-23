import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  updateContactStatus,
} from '../controllers/contact.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  contactSchema,
  statusSchema,
} from '../validators/contact.validator.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Obtiene todos los contactos
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, IN_PROGRESS, CONTACTED, CLOSED]
 *         description: Filtrar por estado del contacto
 *         example: NEW
 *     responses:
 *       200:
 *         description: Lista de contactos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: No autorizado (token ausente o inválido)
 */
router.get('/', getContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Obtiene un contacto por ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Contacto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contacto no encontrado
 */
router.get('/:id', getContactById);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crea un nuevo contacto
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', validate(contactSchema), createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Actualiza un contacto existente
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       200:
 *         description: Contacto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contacto no encontrado
 */
router.put('/:id', validate(contactSchema), updateContact);

/**
 * @swagger
 * /contacts/{id}/status:
 *   patch:
 *     summary: Actualiza solo el estado de un contacto
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [NEW, IN_PROGRESS, CONTACTED, CLOSED]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contacto no encontrado
 */
router.patch('/:id/status', validate(statusSchema), updateContactStatus);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Elimina un contacto
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Contacto eliminado exitosamente
 *       404:
 *         description: Contacto no encontrado
 */
router.delete('/:id', deleteContact);

export default router;
