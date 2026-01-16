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
import { contactSchema } from '../validators/contact.validator.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getContacts);
router.get('/:id', getContactById);
router.post('/', validate(contactSchema), createContact);
router.put('/:id', validate(contactSchema), updateContact);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;
