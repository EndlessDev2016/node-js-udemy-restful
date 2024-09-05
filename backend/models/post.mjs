import { DataTypes, Model } from 'sequelize';
import sequelize from '../util/database.mjs';

/**
 * title: string required
 * imageUrl: string required
 * content: string required
 * creator: object required
 * timestamps: true
 *
 */
const Post = sequelize.define(
  'post',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creator: {
      type: DataTypes.JSON, // Object型に相当するデータ型としてJSONを使用
      allowNull: false,
    },
  },
  {
    timestamps: true, // mongooseのtimestampsオプションに相当する
  }
);

export default Post;

// // Post.initの書き方（defineと同じ）
// class Post extends Model {}

// Post.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     imageUrl: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     creator: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'post',
//   }
// );

// export default Post;
