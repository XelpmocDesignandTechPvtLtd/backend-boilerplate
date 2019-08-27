// TODO: Move this into an external service for secrets
const config = {
  DB_HOST: "localhost",
  DB_DIALECT: "mysql",
  DB_PORT: 3306,
  DB_USERNAME: "root",
  DB_PASSWORD: "",
  DB_NAME: "twitter"
};

export const PASSWORD_MAX = 15;
export const PASSWORD_MIN = 5;

export default config;
