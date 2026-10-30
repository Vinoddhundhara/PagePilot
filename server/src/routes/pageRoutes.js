import { Router } from 'express';
import { getPage, getPages } from '../controllers/pageController.js';
import { validateSlug } from '../middleware/slugValidator.js';

const router = Router();

// GET /api/pages - List all known pages in the workspace
router.get('/', getPages);

// GET /api/pages/* - Fetch and normalize page by slug (supports nested paths)
router.get('/*', validateSlug, getPage);

export default router;
