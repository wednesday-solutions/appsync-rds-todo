module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notes',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'lists',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'notes',
      schema: 'public',
      paranoid: true,
      timestamps: true
    }
  );
};
