import express from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/feed.mjs';
import { body } from 'express-validator';
import { isAuthMiddleware } from '../middleware/is-auth.mjs';

const feedRoutes = express.Router();

// GET /feed/posts
feedRoutes.get('/posts', isAuthMiddleware, getPosts);

feedRoutes.post(
  '/post',
  isAuthMiddleware,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  createPost
);

feedRoutes.get('/post/:postId', isAuthMiddleware, getPost);

feedRoutes.put(
  '/post/:postId',
  isAuthMiddleware,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  updatePost
);

feedRoutes.delete(
  '/post/:postId',

  deletePost
);

export default feedRoutes;
