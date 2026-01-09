
const express = require('express');
const router = express.Router();

const { Story } = require('../database/index')


const findFullStory = (storyObj) => {
  console.log(storyObj);
};

router.get('/all', (req, res) => {
  Story.findAll({})
    .then(stories => {
      const allStories = stories.map(story => findFullStory(story));
      res.status(200).send(allStories);
    })
    .catch(err => {
      console.error('Unable to retrieve all stories on server: ', err);
      res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Story.findOne({ where: { id }})
    .then(story => {
      if (story) {
        const fullStory = findFullStory(story);
        res.status(200).send(fullStory);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error('Unable to retrieve story on server: ', err);
      req.sendStatus(500);
    });
});

module.exports = router;
