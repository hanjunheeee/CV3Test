/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('homeshopping_rankings', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    hs_kind: {
      type: Sequelize.ENUM('라방', '홈쇼핑'),
      allowNull: false,
    },
    rank: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    company: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    classification: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    broadcast_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    view_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sales_volume: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    revenue: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    product_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    source_url: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  await queryInterface.addIndex('homeshopping_rankings', ['hs_kind', 'rank'], {
    name: 'idx_homeshopping_rankings_hs_kind_rank',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('homeshopping_rankings');
}
