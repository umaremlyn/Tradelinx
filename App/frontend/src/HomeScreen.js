import React, { useEffect, useState } from 'react';
import './HomeScreen.css';

// This would be fetched from the backend in a real app
const fetchPosts = async () => {
  // Simulate API call
  return [
    {
      id: 1,
      business: 'Business Username',
      slogan: 'Your Business Slogan Here',
      image: '',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      business: 'Business Username',
      slogan: 'Your Business Slogan Here',
      image: '',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];
};

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load feed');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="home-feed-container">Loading...</div>;
  if (error) return <div className="home-feed-container">{error}</div>;

  return (
    <div className="home-feed-container">
      {posts.map(post => (
        <div className="home-feed-card" key={post.id}>
          <div className="home-feed-header">
            <div className="home-feed-avatar"><span role="img" aria-label="avatar">👤</span></div>
            <div className="home-feed-business">
              <div className="home-feed-business-name">{post.business}</div>
              <div className="home-feed-business-slogan">{post.slogan}</div>
            </div>
          </div>
          <div className="home-feed-body">
            <div className="home-feed-img-placeholder">
              <span role="img" aria-label="image">🖼️</span>
            </div>
            <div className="home-feed-content">{post.content}</div>
          </div>
          <div className="home-feed-actions">
            <button className="home-feed-action-btn" aria-label="Like">👍</button>
            <button className="home-feed-action-btn" aria-label="Comment">💬</button>
            <button className="home-feed-action-btn" aria-label="Share">🔗</button>
            <button className="home-feed-action-btn" aria-label="Cart">🛒</button>
            <span className="home-feed-report">Report trader</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeScreen;
