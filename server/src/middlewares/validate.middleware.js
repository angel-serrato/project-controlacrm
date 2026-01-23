// Middleware genérico para validación con Joi
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map((detail) => detail.message),
      });
    }
    // Reemplazar body con valores validados y limpios
    req.body = value;
    next();
  };
}
