import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the news has been fetched in the last 24 hours
    const lastFetched = localStorage.getItem('lastFetched');
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastFetched;

    // If news is older than 24 hours, fetch again
    if (!lastFetched || timeDiff > 24 * 60 * 60 * 1000) {
      // Make the API request to fetch WWE news (only English)
      fetch(`https://gnews.io/api/v4/search?q=wwe&lang=en&token=${process.env.REACT_APP_GNEWS_API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.articles || data.articles.length === 0) {
            setError('No WWE news available at the moment.');
          } else {
            // Filter articles where title or description contains "wwe"
            const filteredArticles = data.articles.filter(article =>
              (article.title && article.title.toLowerCase().includes('wwe')) ||
              (article.description && article.description.toLowerCase().includes('wwe'))
            );

            if (filteredArticles.length === 0) {
              setError('No WWE news available after filtering.');
            } else {
              setArticles(filteredArticles);
              // Save the fetched articles in localStorage with timestamp
              localStorage.setItem('articles', JSON.stringify(filteredArticles));
              localStorage.setItem('lastFetched', currentTime.toString());
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching news:', err);
          setError('Failed to load news. Please try again later.');
          setLoading(false);
        });
    } else {
      // If news is less than 24 hours old, use cached data
      const cachedArticles = JSON.parse(localStorage.getItem('articles'));
      if (cachedArticles) {
        setArticles(cachedArticles);
        setLoading(false);
      } else {
        setError('No news available.');
        setLoading(false);
      }
    }
  }, []);

  // Handle the loading state
  if (loading) return <p>Loading news...</p>;

  // Handle errors if any
  if (error) return <p>{error}</p>;

  return (
    <div className="news-list">
      <h2>WWE News</h2>
      {articles.map((article) => (
        <div key={article.title} className="news-card">
          <Link 
            to={`/news/${article.title.replace(/ /g, '-').toLowerCase()}`} 
            state={{ article }}
          >
            {/* Check if image exists; use a placeholder if not */}
            <img
              src={article.image || 'https://via.placeholder.com/300'}
              alt={article.title || 'No Image'}
              style={{ maxWidth: '100%' }}
            />
            {/* Check if title exists */}
            <h3>{article.title || 'No Title'}</h3>
            {/* Check if description exists */}
            <p>{article.description || 'No Description Available'}</p>
            {/* Handle date format and missing date */}
            <span>{new Date(article.publishedAt).toLocaleDateString() || 'Unknown Date'}</span>
          </Link>

          {/* Add this button after the Link */}
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <button 
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Read Full Article
            </button>
          </a>
        </div>
      ))}
    </div>
  );
};

export default News;
