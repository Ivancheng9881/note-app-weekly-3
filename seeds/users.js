exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("notes")
    .del()
    .then(() => {
      return knex("users")
        .del()
        .then(function () {
          // Inserts seed entries
          return knex("users")
            .insert([
              { username: "test", password: "123" },
              { username: "test2", password: "456" },
            ])
            .then(() => {
              return knex("notes").insert([
                {
                  content: "Some random text for you to check out",
                  user_id: 1,
                },
                {
                  content:
                    "Same here, just some random text, just not as cool as test 1 though",
                  user_id: 2,
                },
              ]);
            });
        });
    });
};
