import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env explicitly regardless of whether process was launched from root or server
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  
  pagepilot: {
    baseUrl: (process.env.PAGEPILOT_BASE_URL || 'https://pagepilot.fabbuilder.com/api').replace(/\/+$/, ''),
    workspaceId: process.env.PAGEPILOT_WORKSPACE_ID || '6ac26e06fb3d2c14cbf71f89,6336128a251dcbda38bd8fe1',
    workspaceIds: (process.env.PAGEPILOT_WORKSPACE_ID || '6ac26e06fb3d2c14cbf71f89,6336128a251dcbda38bd8fe1')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean),
    apiKey: process.env.PAGEPILOT_API_KEY || '',
    cacheTtlMs: parseInt(process.env.PAGE_CACHE_TTL_SECONDS || '60', 10) * 1000,
    timeoutMs: 15000,
  },
  
  // Safe helper to check if service is configured without exposing secrets
  isPagePilotConfigured() {
    return Boolean(this.pagepilot.baseUrl && this.pagepilot.workspaceIds.length > 0);
  },

  getPublicStatus() {
    return {
      status: 'online',
      configured: this.isPagePilotConfigured(),
      baseUrl: this.pagepilot.baseUrl,
      workspaceIdMasked: this.pagepilot.workspaceId
        ? `${this.pagepilot.workspaceId.slice(0, 6)}...${this.pagepilot.workspaceId.slice(-4)}`
        : 'Not Set',
      cacheTtlSeconds: this.pagepilot.cacheTtlMs / 1000,
    };
  }
};

export default config;
