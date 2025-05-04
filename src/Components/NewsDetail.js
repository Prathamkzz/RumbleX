import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { slug } = useParams(); // Getting the dynamic slug from URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching news based on the slug (which will be the title of the article)
    fetch(`https://gnews.io/api/v4/search?q=wwe&token=${process.env.REACT_APP_GNEWS_API_KEY}`)

      .then((res) => res.json())
      .then((data) => {
        if (data.articles.length > 0) {
          setArticle(data.articles[0]); // We use the first article if there's any match
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching article:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>Loading article...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="news-detail">
      <Link to="/news" style={{ display: 'block', marginBottom: '1rem' }}>← Back to News</Link>
      <img src={article.image || 'default-image.jpg'} alt={article.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      <h1>{article.title}</h1>
      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      <p style={{ marginTop: '1rem' }}>{article.content || article.description}</p>
    </div>
  );
};

export default NewsDetail;
