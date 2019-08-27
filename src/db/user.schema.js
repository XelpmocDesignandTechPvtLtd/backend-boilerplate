import Sequelize, { SEQUELIZE } from "sequelize";
import { PASSWORD_MAX, PASSWORD_MIN } from "./config";
const UserSchema = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

export default UserSchema;
