import Joi from 'joi';

export const contactSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'El nombre es obligatorio.',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'El apellido es obligatorio.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido.',
    'string.empty': 'El email es obligatorio.',
  }),
  phone: Joi.string().allow('').messages({
    'string.base': 'El teléfono debe ser un texto.',
  }),
  status: Joi.string()
    .valid('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED')
    .default('NEW')
    .messages({
      'any.only':
        'El estado debe ser uno de: NEW, IN_PROGRESS, CONTACTED, CLOSED.',
    }),
  notes: Joi.string().allow('').messages({
    'string.base': 'Las notas deben ser un texto.',
  }),
  assignedTo: Joi.string().required().messages({
    'string.empty': 'El usuario asignado es obligatorio.',
  }),
  active: Joi.boolean().default(true),
});
