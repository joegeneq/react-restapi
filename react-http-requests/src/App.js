import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      const data = await response.json();
      setPosts([...posts, data]);
      setNewPost({ title: '', body: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPost),
      });
      const data = await response.json();

      // Update the posts array with the modified post
      const updatedPosts = posts.map(post => (post.id === editPost.id ? data : post));
      setPosts(updatedPosts);
      setEditPost(null); // Clear edit mode
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="App">
      <h1>Posts</h1>

      {/* Create Post Form */}
      <h2>Create New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={newPost.title}
        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        placeholder="Body"
        value={newPost.body}
        onChange={e => setNewPost({ ...newPost, body: e.target.value })}
      />
      <button onClick={createPost}>Create</button>

      {/* Edit Post Form (Conditional Rendering) */}
      {editPost && (
        <div>
          <h2>Edit Post</h2>
          <input
            type="text"
            value={editPost.title}
            onChange={e => setEditPost({ ...editPost, title: e.target.value })}
          />
          <textarea
            value={editPost.body}
            onChange={e => setEditPost({ ...editPost, body: e.target.value })}
          />
          <button onClick={updatePost}>Update</button>
          <button onClick={() => setEditPost(null)}>Cancel Edit</button>
        </div>
      )}


      {/* Display Posts */}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => setEditPost(post)}>Edit</button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;