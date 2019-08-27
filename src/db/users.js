/**
 * Stub implementation of database methods related to accessing
 * stored users.
 *
 * NOTE: this is a stub implementation meant to demonstrate how
 * the rest of the application can work.
 */

import { hashPassword, comparePassword } from "../lib/crypto";
import BaseModel from "./base";
import UserSchema from "./user.schema";
import uuid from "uuid";
import HttpStatus from "http-status-codes";
import { ApplicationError } from "../lib/errors";
const PUBLIC_FIELDS = ["id", "email"];

const filterFields = (toFilter, allowedFields) => {
  return allowedFields.reduce((memo, field) => {
    return { ...memo, [field]: toFilter[field] };
  }, {});
};

export class UsersDB extends BaseModel {
  constructor() {
    super();
    this.model = this.connection.define("User", UserSchema);
  }
  /**
   * Finds a user based on an id/password pair. If user doesn't exist
   * or password doesn't match, this function returns null.
   * @param {string} id user's id
   * @param {string} password user's password
   */
  getUserByCredentials = async (id, password) => {
    console.log("GET USER BY CREDENTIALS");
    console.log(id);
    console.log(password);
    try {
      const user = await this.getUserById(id, false);
      console.log("FOUNDER USER");
      console.log(user);
      if (!user) {
        throw new ApplicationError(
          "User not found",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      console.log("POST USER");

      if (await comparePassword(password, user.password)) {
        console.log("TEST");
        const test = filterFields(user, PUBLIC_FIELDS);
        console.log(test);
        return test;
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   * Finds a user based on its id. If user doesn't exist, this
   * function returns null.
   * @param {string} id user's id
   * @param {boolean} filterPrivateFields filter out private
   * fields. defaults to true
   */
  getUserById = async (id, filterPrivateFields = true) => {
    try {
      const foundUser = await this.model.findOne({
        raw: true,
        where: {
          id
        }
      });
      if (filterPrivateFields) {
        return filterFields(foundUser, PUBLIC_FIELDS);
      }
      return foundUser;
    } catch (e) {
      throw new ApplicationError(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * Creates a new user and stores it in the database.
   * @param {string} userName the new user's userName
   * @param {string} password the new user's password
   */
  create = async (email, password) => {
    const newUserId = uuid.v4();
    const newUser = {
      id: newUserId,
      email,
      password: await hashPassword(password)
    };
    try {
      const createdUser = await this.model.create(newUser);
      return filterFields(createdUser, PUBLIC_FIELDS);
    } catch (e) {
      throw new ApplicationError(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}

export default new UsersDB(); // singleton instance of the database
