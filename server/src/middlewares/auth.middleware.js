import jwt from 'jsonwebtoken';

// Validar que JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not configured');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó token de autenticación',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Use: Bearer <token>',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Diferenciar tipos de error
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o malformado',
          code: 'INVALID_TOKEN',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Error al verificar el token',
        code: 'VERIFICATION_ERROR',
      });
    }

    // Validar estructura del payload
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'Token con estructura inválida',
        code: 'INVALID_PAYLOAD',
      });
    }

    req.user = decoded;
    next();
  });
};
