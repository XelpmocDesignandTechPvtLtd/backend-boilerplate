import sequelize from "./sequelize";

export default class BaseModel {
  constructor() {
    this.connection = sequelize;
  }
}
