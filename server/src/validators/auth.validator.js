import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.base': 'El email debe ser un texto',
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña es obligatoria',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base':
        'La contraseña debe tener 8+ caracteres, 1 mayúscula, 1 número',
      'any.required': 'La contraseña es obligatoria',
    }),
  role: Joi.string().valid('admin', 'sales').required().messages({
    'any.only': 'El rol debe ser "admin" o "sales"',
    'string.base': 'El rol debe ser un texto',
    'any.required': 'El rol es obligatorio',
  }),
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
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
}).unknown(false);

export function validateRegister(req, res, next) {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: messages,
    });
  }
  req.body = value;
  next();
}

export function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: messages,
    });
  }
  req.body = value;
  next();
}
