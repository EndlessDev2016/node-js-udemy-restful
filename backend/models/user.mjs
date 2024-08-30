import { DataTypes } from 'sequelize';
import sequelize from '../util/database.mjs';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  password: DataTypes.STRING,
  resetToken: DataTypes.STRING,
  resetTokenExpiration: DataTypes.DATE,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

export default User;
