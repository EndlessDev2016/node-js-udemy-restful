import express from 'express';
import { createPost, getPost, getPosts } from '../controllers/feed.mjs';
import { body } from 'express-validator';

const feedRoutes = express.Router();

// GET /feed/posts
feedRoutes.get('/posts', getPosts);

feedRoutes.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  createPost
);

feedRoutes.get('/post/:postId', getPost);

export default feedRoutes;
