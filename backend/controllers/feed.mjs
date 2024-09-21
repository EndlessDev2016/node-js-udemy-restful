import { validationResult } from 'express-validator';
import Post from '../models/post.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chalk from 'chalk';
import User from '../models/user.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  // mongooseは、Post.find().countDocuments()を使うことができる。
  // sequelizeは、Post.count()を使う。
  console.log(chalk.bgYellowBright('getPosts -  Post.count() executed.'));
  Post.count()
    .then((count) => {
      // totalItemsにcountを代入
      totalItems = count;
      // mongooseは、Post.find().skip().limit()を使うことができる。
      // return Post.find()
      //  .skip((currentPage - 1) * perPage)
      //  .limit(perPage);
      // sequelizeは、以下のように書く。
      return Post.findAll({
        offset: (currentPage - 1) * perPage,
        limit: perPage,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  Post.findAll({
    include: {
      model: User,
      attributes: ['_id', 'name'],
    },
  })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts: posts.map((post) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          creator: { _id: post.user._id, name: post.user.name },
        })),
        totalItems,
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
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageUrl,
    userId: req.userId,
    creatorId: req.userId,
  });

  post
    .save()
    .then((result) => {
      return User.findByPk(req.userId);
    })
    .then((result) => {
      console.log(chalk.bgGreenBright('createPost :: ', result));
      res.status(201).json({
        message: 'Post created successfully!',
        post: { post, creator: { _id: result._id, name: result.name } },
        creator: { _id: result._id, name: result.name },
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

/**
 * updatePost
 * @param req - Request
 * @param res - Response
 * @param next - Next
 * @description
 * Update post
 */
export const updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  // PostテーブルからpostIdを検索する。
  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      // postのcreatorIdとreq.userIdが異なる場合、エラーを返す。
      if (post.creatorId !== req.userId) {
        const error = new Error('Not authorized update post.');
        error.statusCode = 403;
        throw error;
      }

      // アップロードされた画像が異なる場合、古い画像を削除する。
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // throw err; // これを使うとエラーハンドリングができるが、middlewareまでに到達しない。
      next(err);
    });
};

export const deletePost = (req, res, next) => {
  // TODO: delete post
  const postId = req.params.postId;
  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      if (post.creatorId !== req.userId) {
        const error = new Error('Not authorized delete post.');
        error.statusCode = 403;
        throw error;
      } 

      clearImage(post.imageUrl);
      // mongooseは、findByIdAndRemove()を使うことができる。
      // sequelizeは、destroy()を使う。
      return Post.destroy({ where: { _id: postId } });
    })
    .then((result) => {
      console.log(chalk.bgGreenBright(result));
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // throw err; // これを使うとエラーハンドリングができるが、middlewareまでに到達しない。
      next(err);
    });
};

/**
 * @param {string} filePath
 * @description Clear image
 */
const clearImage = (filePath) => {
  // TODO: clear image
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
