import pagepilotService from '../services/pagepilotService.js';

export async function getPage(req, res, next) {
  try {
    const slug = req.normalizedSlug || 'home';
    const isPreview = req.query.mode === 'preview';

    const pageData = await pagepilotService.fetchPageBySlug(slug, isPreview);

    res.status(200).json({
      success: true,
      data: pageData,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPages(req, res, next) {
  try {
    const pagesIndex = await pagepilotService.listPages();

    res.status(200).json({
      success: true,
      data: pagesIndex,
    });
  } catch (err) {
    next(err);
  }
}
