import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'El email debe ser un texto',
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'La contraseña debe ser un texto',
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
  role: Joi.string().valid('admin', 'sales').default('sales').messages({
    'any.only': 'El rol debe ser "admin" o "sales"',
    'string.base': 'El rol debe ser un texto',
  }),
  active: Joi.boolean().default(true).messages({
    'boolean.base': 'El campo activo debe ser verdadero o falso',
  }),
});

export function validateUser(req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
