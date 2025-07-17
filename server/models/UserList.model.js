/**
 * UserList Model
 * Represents users in the system with authentication and role management
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DataTypes - Sequelize data types
 * @returns {Object} UserList model
 */
module.exports = (sequelize, DataTypes) => {
  const UserList = sequelize.define(
    "UserList",
    {
      /**
       * Unique identifier for the user
       * @type {string} UUID
       */
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      /**
       * Foreign key reference to employee (UUID)
       * @type {string} UUID
       */
      employeeId: {
        type: DataTypes.UUID, // Changed from INTEGER to UUID
        allowNull: false,
        references: {
          model: "Employees", // Make sure this matches your Employee table name
          key: "id",
        },
      },
      /**
       * User role in the system
       * @type {string}
       */
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      /**
       * Current status of the user account
       * @type {string}
       */
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      /**
       * Last time the user was seen/active
       * @type {Date}
       */
      lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      /**
       * Unique username for login
       * @type {string}
       */
      userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      /**
       * Encrypted password for authentication
       * @type {string}
       */
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255],
        },
      },
      /**
       * Flag to track if user has completed first login
       * @type {boolean}
       */
      firstLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "UserList",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "username_unique_idx",
          unique: true,
          fields: ["user_name"],
        },
        {
          name: "employee_id_idx",
          fields: ["employee_id"],
        },
        {
          name: "status_idx",
          fields: ["status"],
        },
        {
          name: "role_idx",
          fields: ["role"],
        },
      ],
    }
  );

  /**
   * Define model associations
   * @param {Object} models - All defined models
   */
  UserList.associate = (models) => {
    // Association with Employee model
    UserList.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add other associations here when needed
    // Example: UserList.hasMany(models.UserSession, { foreignKey: 'userId' });
  };

  /**
   * Instance method to update last seen timestamp
   */
  UserList.prototype.updateLastSeen = function () {
    this.lastSeen = new Date();
    return this.save();
  };

  /**
   * Instance method to mark first login as completed
   */
  UserList.prototype.completeFirstLogin = function () {
    this.firstLogin = false;
    return this.save();
  };

  /**
   * Class method to find active users
   * @returns {Promise<Array>} Array of active users
   */
  UserList.findActiveUsers = function () {
    return this.findAll({
      where: {
        status: "active",
      },
    });
  };

  return UserList;
};
