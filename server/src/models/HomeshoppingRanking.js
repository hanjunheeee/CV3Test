import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const HomeshoppingRanking = sequelize.define(
  'HomeshoppingRanking',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    hsKind: {
      type: DataTypes.ENUM('라방', '홈쇼핑'),
      allowNull: false,
      field: 'hs_kind',
    },
    rank: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    classification: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    broadcastAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'broadcast_at',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'view_count',
    },
    salesVolume: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'sales_volume',
    },
    revenue: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    productCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'product_count',
    },
    sourceUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'source_url',
    },
  },
  {
    tableName: 'homeshopping_rankings',
    underscored: true,
    timestamps: true,
  }
);
