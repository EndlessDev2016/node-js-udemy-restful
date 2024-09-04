import { validationResult } from 'express-validator';
import Post from '../models/post.mjs';

export const getPosts = (req, res, next) => {
  Post.findAll()
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  console.log(req.body.title, req.body.content);
  const post = new Post({
    title,
    content,
    imageUrl: 'images/sad2.png',
    creator: { name: 'Lee Seunghun' },
  });

  post
    .save()
    .then((result) => {
      // TODO: response
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // throw err; // これを使うとエラーハンドリングができるが、middlewareまでに到達しない。
      next(err);
    });
};
