module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'lists',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'lists',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'list__idx__name',
          fields: [{ name: 'name' }]
        },
        {
          name: 'lists_pkey',
          unique: true,
          fields: [{ name: 'id' }]
        }
      ]
    }
  );
};
