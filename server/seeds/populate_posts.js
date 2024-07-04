// A library for generating mock data
import casual from 'casual';

export const seed = function (knex) {
  // First, delete all posts from the table
  return knex('posts')
    .del()
    .then(() => {
      // Next delete a mock user
      return knex('users').del().where({ username: 'dummy-user' });
    })
    .then(() => {
      // Then create a mock user (so we have more than one account for testing posts)
      return knex('users').insert({
        github_id: 92953487,
        avatar_url: 'https://avatars.githubusercontent.com/u/92953487?v=4',
        username: 'dummy-user',
      });
    })
    .then(() => {
      // Get all user ids from users table
      return knex('users').select('id');
    })
    .then((userIds) => {
      const mockPosts = [];

      // Generate 10 posts
      for (let i = 0; i < 10; i++) {
        // Select a user id randomly from the list of users to create a post for
        const randomIndex = Math.floor(Math.random() * userIds.length);
        const randomId = userIds[randomIndex].id;

        // Use user id from users table for user_id and `casual` library to generate mock title and content fields
        mockPosts.push({
          user_id: randomId,
          title: casual.title,
          content: casual.sentences(10),
        });
      }

      // Insert mock posts into the table
      return knex('posts').insert(mockPosts);
    });
};