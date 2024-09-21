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
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // forgein keyとして持つことになったので、creatorは不要
    // creator: {
    //   type: DataTypes.JSON, // Object型に相当するデータ型としてJSONを使用
    //   allowNull: false,
    // },
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

// mongooseの場合
// const postSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   creator: {
//     type: Object,
//     required: true,
//   },
//   creator: { // refを Userにしている場合。
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// });


