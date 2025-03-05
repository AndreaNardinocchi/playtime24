// MVC Model View Controller: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    /**
     * This turns off the session strategy - so these routes can work
     * (and the users can signup/login).
     */
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Playlist" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Playlist" });
    },
  },
  signup: {
    auth: false,
    /**
     * validate object specifying our validation schema
     * (UserSpec) + failAction method,
     * to be called if the validation fails.
     * 'errors: error.details' will enable the signup page to show the errors
     * .takeover() will avoid the redirection to accountController, as Joi will manage the error
     */
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Playlist" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Login error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      // We set the cookie and istall the object 'user', passing the '._id' of te user
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  /**
   * The function has access to a session object - which will have the users ID.
   * We use this ID to locate the user object from the store and, if found,
   * return this object: { isValid: true, credentials: user }; otherwise
   * { valid: false };
   */
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
