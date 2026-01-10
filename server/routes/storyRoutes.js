
const express = require('express');
const router = express.Router();

const { Story } = require('../database/index')


/*
  * Okay so basically here's what I need to do to make this work:

  * I need to rewrite their promptRoutes & newRound (Homepage) to be able to
  * take in a prompt ID, I think? and from there when the prompt is created, it'll store
  * a reference to the prompt that came before it, IF a story is currently ongoing
  * and then when I call findFullStory, I can get the WINNING text from the last prompt of the story,
  * then find its parent and get ITS winning text, and then get ITS parent, and so on and so forth
  * until a parentID is null, in which case I have the full story, and then I can return that
  * to be sent for the get request
  *
  * I intend to refactor my current routes once I have findFullStory actually built out, because
  * I plan to make the function return the query, so that I can .then it in the request handling
  *
  * But I don't really know how to handle the logic for "is a story currently ongoing"?
  * I could do a put request to create / update a story on request, and check if the story has ended
  * but I don't really know what to do after that? just create a new story I guess, and all of this
  * sounds easy enough, but I just don't really know how to translate it to code and it's making me feel
  * very blehhh because I should definitely know this stuff
*/

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

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { story: lastPrompt, hasEnded = false } = req.body;
  Story.findOrCreate({ where: { id }, defaults: { lastPrompt, hasEnded }})
    .then(([story, created]) => {
      res.sendStatus(created ? 201 : 204);
    })
    .catch(err => {
      console.error('Could not findOrCreate story on server: ', err);
    });
});

module.exports = router;
