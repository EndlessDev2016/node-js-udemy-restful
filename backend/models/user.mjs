import { DataTypes } from 'sequelize';
import sequelize from '../util/database.mjs';

// mongooseの場合
// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   posts: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'Post',
//     },
//   ],
// });

const User = sequelize.define('user', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'I am new!',
  },
});

// こちらは、前のudemy講座で使用したコード。参照。
// const User = sequelize.define('user', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   password: DataTypes.STRING,
//   resetToken: DataTypes.STRING,
//   resetTokenExpiration: DataTypes.DATE,
//   name: DataTypes.STRING,
//   email: DataTypes.STRING,
// });

export default User;
