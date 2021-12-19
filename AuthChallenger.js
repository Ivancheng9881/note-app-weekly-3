const AuthChallenger = function () {
    return async function (username, password, cb) {
      console.log(username, password);
      // const knexConfig = require("./knexfile").testing;
      const knex = require("knex")({
        client: "postgresql",
        connection: {
          database: "knexnoteapp",
          user: "ivancheng",
          password: "password",
        },
      });
      try {
        let query = await knex
          .select("username")
          .from("users")
          .where("username", username)
          .where("password", password);
        console.log(query);
        if (query.length === 1) {
          return cb(null, true);
          //we have found the user with this username and password.
        } else {
          return cb(null, false);
          //no such user....
        }
      } catch (err) {
        console.log(err);
      }
    };
  };
  module.exports = AuthChallenger;