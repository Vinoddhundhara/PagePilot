import config from '../config/index.js';

export function getHealth(req, res) {
  const publicConfig = config.getPublicStatus();

  res.status(200).json({
    success: true,
    data: {
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      configuration: publicConfig,
      message: publicConfig.configured
        ? 'PagePilot integration is configured and active.'
        : 'PagePilot workspace ID is missing. Please configure server/.env.',
    },
  });
}
