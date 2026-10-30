import app from './app.js';
import config from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 PagePilot MERN Backend Server Running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📄 Pages API:    http://localhost:${PORT}/api/pages`);
  console.log(`⚙️  Provider Configured: ${config.isPagePilotConfigured() ? 'YES' : 'NO'}`);
  console.log(`===============================================`);
});
