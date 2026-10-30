import config from '../config/index.js';

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred.';

  // Log error diagnostics safely (without leaking sensitive headers or tokens)
  console.error(`[Error] [${req.method} ${req.originalUrl}] Status: ${status} | Code: ${code} | Message: ${message}`);

  const errorResponse = {
    success: false,
    error: {
      message,
      code,
      status,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };

  // Only include stack trace in local development if explicitly needed
  if (config.nodeEnv === 'development' && status === 500) {
    errorResponse.error.debug = err.stack;
  }

  res.status(status).json(errorResponse);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
      code: 'API_ENDPOINT_NOT_FOUND',
      status: 404,
    },
  });
}
