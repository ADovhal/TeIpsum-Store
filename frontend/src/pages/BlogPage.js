import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const BlogContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }

  @media (max-width: 480px) {
    padding: 20px 10px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    max-width: 1000px;
  }

  @media (max-width: 992px) {
    max-width: 900px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const HeroSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    padding: 50px 40px;
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    padding: 40px 30px;
    margin-bottom: 30px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
    margin-bottom: 20px;
    border-radius: 10px;
  }
`;

const Title = styled(motion.h1)`
  color: #2c3e50;
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: 992px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    padding: 25px;
    gap: 15px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    gap: 10px;
  }
`;

const CategoryButton = styled.button`
  padding: 12px 25px;
  border: 2px solid ${props => props.active ? '#9b59b6' : '#ecf0f1'};
  background: ${props => props.active ? '#9b59b6' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    border-color: #9b59b6;
    background: ${props => props.active ? '#8e44ad' : '#f8f9fa'};
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.85rem;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.8rem;
    border-radius: 15px;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 25px;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const BlogCard = styled(motion.article)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 992px) {
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    border-radius: 12px;

    &:hover {
      transform: translateY(-3px);
    }
  }

  @media (max-width: 480px) {
    border-radius: 10px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    }
  }
`;

const BlogImage = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #f39c12, #e67e22);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;

  @media (max-width: 768px) {
    height: 180px;
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    height: 150px;
    font-size: 2rem;
  }
`;

const BlogContent = styled.div`
  padding: 30px;

  @media (max-width: 992px) {
    padding: 25px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const BlogCategory = styled.span`
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 12px;
  }
`;

const BlogTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 15px 0 10px 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin: 12px 0 8px 0;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin: 10px 0 6px 0;
  }
`;

const BlogExcerpt = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
    line-height: 1.5;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
  font-size: 0.9rem;
  color: #7f8c8d;

  @media (max-width: 768px) {
    padding-top: 15px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding-top: 12px;
    font-size: 0.8rem;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
`;

const ReadMoreButton = styled.button`
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 12px;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const LoadMoreSection = styled.div`
  text-align: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 30px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const LoadMoreButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  color: #9b59b6;
  border: 2px solid #9b59b6;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: #9b59b6;
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 0.9rem;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.85rem;
    border-radius: 15px;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visiblePosts, setVisiblePosts] = useState(6);
  const { t } = useLanguage();

  const categories = [
    { id: 'all', label: `${t('allPosts')}` },
    { id: 'fashion', label: `${t('fashion')}` },
    { id: 'sustainability', label: `${t('sustainability')}` },
    { id: 'style-tips', label: `${t('styleTips')}` },
    { id: 'company', label: `${t('companyNews')}` },
    { id: 'trends', label: `${t('trends')}` }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Sustainable Fashion: The Future is Here",
      excerpt: "Discover how TeIpsum is leading the charge in sustainable fashion with eco-friendly materials and ethical production practices.",
      category: "sustainability",
      author: "Emma Green",
      date: "January 15, 2025",
      readTime: `5 ${t('minRead')}`,
      icon: "🌱"
    },
    {
      id: 2,
      title: "Spring 2025 Color Trends",
      excerpt: "Explore the vibrant colors that will define spring fashion this year, from soft pastels to bold earth tones.",
      category: "trends",
      author: "Sofia Martinez",
      date: "January 12, 2025",
      readTime: `4 ${t('minRead')}`,
      icon: "🎨"
    },
    {
      id: 3,
      title: "How to Style Your Capsule Wardrobe",
      excerpt: "Master the art of minimalist dressing with our guide to creating versatile outfits from essential pieces.",
      category: "style-tips",
      author: "Alex Chen",
      date: "January 10, 2025",
      readTime: `6 ${t('minRead')}`,
      icon: "👔"
    },
    {
      id: 4,
      title: "TeIpsum Opens New Flagship Store",
      excerpt: "We're excited to announce the opening of our new flagship store in Warsaw, featuring our complete collection and personalized styling services.",
      category: "company",
      author: "TeIpsum Team",
      date: "January 8, 2025",
      readTime: `3 ${t('minRead')}`,
      icon: "🏪"
    },
    {
      id: 5,
      title: "The Art of Layering in Winter",
      excerpt: "Stay warm and stylish with our expert tips on layering techniques that work for any winter occasion.",
      category: "style-tips",
      author: "Maya Patel",
      date: "January 5, 2025",
      readTime: `5 ${t('minRead')}`,
      icon: "🧥"
    },
    {
      id: 6,
      title: "Behind the Scenes: Our Design Process",
      excerpt: "Take a peek into our creative process and see how our designers bring sustainable fashion concepts to life.",
      category: "fashion",
      author: "Design Team",
      date: "January 3, 2025",
      readTime: `7 ${t('minRead')}`,
      icon: "✏️"
    },
    {
      id: 7,
      title: "Denim Decoded: Finding Your Perfect Fit",
      excerpt: "From skinny to wide-leg, discover which denim styles work best for your body type and personal style.",
      category: "style-tips",
      author: "Jordan Blake",
      date: "December 28, 2024",
      readTime: `4 ${t('minRead')}`,
      icon: "👖"
    },
    {
      id: 8,
      title: "Circular Fashion: Our Recycling Initiative",
      excerpt: "Learn about our new take-back program and how we're turning old garments into new sustainable fashion pieces.",
      category: "sustainability",
      author: "Environmental Team",
      date: "December 25, 2024",
      readTime: `6 ${t('minRead')}`,
      icon: "♻️"
    },
    {
      id: 9,
      title: "Accessorizing 101: Small Details, Big Impact",
      excerpt: "Transform any outfit with the right accessories. Our styling experts share their top tips for accessory mastery.",
      category: "style-tips",
      author: "Styling Team",
      date: "December 22, 2024",
      readTime: `5 ${t('minRead')}`,
      icon: "💎"
    }
  ];

  const filteredPosts = blogPosts.filter(post => 
    activeCategory === 'all' || post.category === activeCategory
  );

  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const handleReadMore = (postTitle) => {
    // In a real application, this would navigate to the full blog post
    alert(`Opening full article: "${postTitle}"`);
  };

  const blogPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TeIpsum Blog",
    "description": "Stay updated with the latest fashion trends, sustainability news, style tips, and behind-the-scenes stories from TeIpsum.",
    "publisher": {
      "@type": "Organization",
      "name": "TeIpsum",
      "logo": {
        "@type": "ImageObject",
        "url": "https://teipsum.com/images/logo.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogPosts.slice(0, 5).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "datePublished": post.date,
          "url": `https://teipsum.com/blog/${post.id}`
        }
      }))
    }
  };

  return (
    <BlogContainer>
      <SEO
        title={t('blogTitle')}
        description="Stay updated with the latest fashion trends, sustainability news, style tips, and behind-the-scenes stories from TeIpsum. Discover sustainable fashion insights and expert advice."
        keywords="fashion blog, style tips, sustainable fashion trends, fashion news, TeIpsum blog, fashion advice, sustainability fashion, eco-friendly fashion tips"
        canonicalUrl="/blog"
        image="/images/teipsum-blog.jpg"
        imageAlt="TeIpsum Fashion Blog - Trends and Sustainability"
        type="blog"
        structuredData={blogPageStructuredData}
      />
      
      <ContentWrapper>
        <HeroSection>
          <Title
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            TeIpsum {t('blog')}
          </Title>
          <Subtitle>
            Stay updated with the latest fashion trends, sustainability news, style tips, 
            and behind-the-scenes stories from the TeIpsum team.
          </Subtitle>
        </HeroSection>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FilterSection>
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setVisiblePosts(6);
                }}
              >
                {category.label}
              </CategoryButton>
            ))}
          </FilterSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BlogGrid>
            {displayedPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogImage>
                  {post.icon}
                </BlogImage>
                <BlogContent>
                  <BlogCategory>{post.category.replace('-', ' ')}</BlogCategory>
                  <BlogTitle>{post.title}</BlogTitle>
                  <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                  <ReadMoreButton onClick={() => handleReadMore(post.title)}>
                    {t('readMore')}
                  </ReadMoreButton>
                  <BlogMeta>
                    <AuthorInfo>
                      <AuthorAvatar>
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AuthorAvatar>
                      <div>
                        <div>{post.author}</div>
                        <div>{post.date}</div>
                      </div>
                    </AuthorInfo>
                    <div>{post.readTime}</div>
                  </BlogMeta>
                </BlogContent>
              </BlogCard>
            ))}
          </BlogGrid>
        </motion.div>

        {displayedPosts.length < filteredPosts.length && (
          <LoadMoreSection>
            <LoadMoreButton onClick={handleLoadMore}>
              {t('loadMoreArticles')}
            </LoadMoreButton>
          </LoadMoreSection>
        )}

        {filteredPosts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            color: '#7f8c8d'
          }}>
            <h3>No articles found</h3>
            <p>Try selecting a different category or check back later for new content.</p>
          </div>
        )}
      </ContentWrapper>
    </BlogContainer>
  );
};

export default BlogPage; 