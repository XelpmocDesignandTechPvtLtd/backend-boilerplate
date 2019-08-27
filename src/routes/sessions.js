import { ApplicationError } from "../lib/errors";
import { decodeToken, generateToken } from "../lib/token";
import usersDB from "../db/users";
import { route } from "./";

export const authenticate = route(
  async (req, res, next) => {
    // TODO: this is a stub implementation that just checks if the password
    // is the same as the username. Implement real authentication, then return
    // user metadata in the JSON web token as you desire.
    console.log(req.body);
    const { id, password } = req.body;

    const user = await usersDB.getUserByCredentials(id, password);
    if (!user) {
      throw new ApplicationError("Invalid credentials", 401);
    }

    const token = await generateToken(id);

    // send the response, along with the token to be used in the Bearer header
    // (see verify below)
    res.send({
      message: "success",
      data: {
        token,
        user
      }
    });
  },
  {
    requiredFields: ["id", "password"]
  }
);

// middleware that verifies that a token is present and is legitimate.
export const verify = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(
      new ApplicationError(
        "Missing Authorization header with Bearer token",
        401
      )
    );
    return;
  }

  // strip the leading "Bearer " part from the rest of the token string
  const token = authHeader.substring("Bearer ".length);
  try {
    const decoded = await decodeToken(token);
    const user = await usersDB.getUserById(decoded.id);
    if (!user) {
      // just triggers the catch block below, contents of error are
      // ignored
      throw new ApplicationError("Not found");
    }
    res.locals.authData = decoded;
    next();
  } catch (err) {
    // assume failed decoding means bad token string
    next(new ApplicationError("Could not verify token", 401));
  }
};
