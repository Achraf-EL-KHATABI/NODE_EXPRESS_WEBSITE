const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

const routes = require('./routes');

const FeedbackServie = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');
const { request, response } = require('express');

const feedbackService = new FeedbackServie('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['azerty1357twelve', 'qwerty2468twenty'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('set', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.get('/throw', (req, res, next) => {
  setTimeout(() => {
    throw new Error('Someting did throw!');
  }, 500);
});
// eslint-disable-next-line consistent-return
app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (error) {
    next(error);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((request, response, next) => next(createError(404, 'File not found')));

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express Server listening on port ${port} ...`);
});
