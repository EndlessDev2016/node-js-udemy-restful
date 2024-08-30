// const { DataTypes } = require('sequelize');
import { DataTypes } from 'sequelize';

// const sequelize = require('../util/database');
import sequelize from '../util/database.mjs';

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});

export default CartItem;
