const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const speakers = await speakersService.getList();
      const artwork = await speakersService.getAllArtwork();
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const speaker = await speakersService.getSpeaker(req.params.shortname);
      const artwork = await speakersService.getArtworkForSpeaker(req.params.shortname);
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        speaker,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
