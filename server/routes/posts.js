import express from 'express';
const router = express.Router();

import createKnex from 'knex';
import knexFile from '../knexfile.js';
const knex = createKnex(knexFile);

// Get all posts route
router.get('/', (req, res) => {
  // Select post and user fields by using a join between posts and users tables and order them chronologically, newest first
  knex
    .select(
      'posts.id as post_id',
      'posts.title',
      'posts.content',
      'posts.updated_at',
      'users.id as user_id',
      'users.avatar_url',
      'users.username'
    )
    .from('posts')
    .leftJoin('users', 'posts.user_id', 'users.id')
    .orderBy('posts.id', 'desc')
    .then((posts) => {
      let updatedPosts = posts;

      // Check if user is logged in and update all logged in user's posts with "isCurrentUser" field
      if (req.user) {
        updatedPosts = updatedPosts.map((post) => {
          return {
            ...post,
            isCurrentUser: post.user_id === req.user.id,
          };
        });
      }

      res.status(200).json(updatedPosts);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching posts' });
    });
});

// Create a new post route
router.post('/', (req, res) => {
  // If user is not logged in, we don't allow them to create a new post
  if (req.user === undefined)
    return res.status(401).json({ message: 'Unauthorized' });

  // Validate request body for required fields
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ message: 'Missing post title or content fields' });
  }

  // Insert new post into DB: user_id comes from session, title and content from a request body
  knex('posts')
    .insert({
      user_id: req.user.id,
      title: req.body.title,
      content: req.body.content,
    })
    .then((postId) => {
      // Send newly created postId as a response
      res.status(201).json({ newPostId: postId[0] });
    })
    .catch(() => {
      res.status(500).json({ message: 'Error creating a new post' });
    });
});

// export the router module
export default router;