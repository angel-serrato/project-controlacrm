import Joi from 'joi';

export const registerSchema = Joi.object({
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
  role: Joi.string().valid('admin', 'sales').required().messages({
    'any.only': 'El rol debe ser "admin" o "sales"',
    'string.base': 'El rol debe ser un texto',
    'any.required': 'El rol es obligatorio',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'El email debe ser un texto',
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().required().messages({
    'string.base': 'La contraseña debe ser un texto',
    'string.empty': 'La contraseña es obligatoria',
    'any.required': 'La contraseña es obligatoria',
  }),
});

export function validateRegister(req, res, next) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

export function validateLogin(req, res, next) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
