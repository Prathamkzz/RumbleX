import React from 'react';
import { useLocation,  } from 'react-router-dom';
import './CSS/News.css';

const NewsArticle = () => {
  
  const location = useLocation();
  const { article } = location.state || {};

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div className="news-article">
      <h1>{article.title}</h1>
      <img src={article.image || 'https://via.placeholder.com/300'} alt={article.title} style={{ maxWidth: '100%' }} />
      <p><strong>{new Date(article.publishedAt).toLocaleDateString()}</strong></p>
      <p>{article.content || article.description}</p>
    </div>
  );
};

export default NewsArticle;
