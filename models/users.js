module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'users',
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
      userRef: {
        field: 'user_ref',
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: 'users__idx__user_ref',
          fields: [{ name: 'user_ref' }]
        },
        {
          name: 'users_pkey',
          unique: true,
          fields: [{ name: 'id' }]
        }
      ]
    }
  );
};
