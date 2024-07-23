import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const wish = db.define(
  'wish',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_7: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_8: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_9: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_10: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_11: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_12: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_13: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    // Other model are go here
    freezeTableName: true,
    updatedAt: false,
    createdAt: false,
  },
);
