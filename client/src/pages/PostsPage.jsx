import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the DB
  const fetchPosts = () => {
    // Make sure to user `withCredentials` for a GET request, to pass the cookie to the server
    axios
      .get(`${SERVER_URL}/posts`, { withCredentials: true })
      .then((posts) => {
        // Update state with fetched posts
        setPosts(posts.data);
      })
      .catch((err) => {
        console.log('Error fetching posts:', err);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="posts-page">
      <h1>Posts</h1>

      {/*
        Create new post component.
        Note the passed prop that allows it to re-fetch the posts after new one is created
      */}
      <CreatePost onPostCreate={fetchPosts} />

      {/* Render a list of Post components */}
      {posts.map((post) => (
        <Post key={post.post_id} post={post} />
      ))}
    </section>
  );
};

export default PostsPage;