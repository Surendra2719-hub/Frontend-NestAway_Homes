import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../../services/mockData';

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === MOCK_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section container">
      <h2 className="section-title text-center">What people say about us</h2>

      <div className="testimonials-carousel-wrapper">
        <button className="carousel-arrow prev" onClick={handlePrev} aria-label="Previous review">
          <ChevronLeft size={20} />
        </button>

        <div className="testimonials-grid">
          {MOCK_TESTIMONIALS.map((item, idx) => (
            <div key={item.id} className={`testimonial-card ${idx === activeIndex ? 'active' : ''}`}>
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">{item.quote}</p>
              
              <div className="author-info">
                <img src={item.avatar} alt={item.author} className="author-avatar" />
                <div>
                  <h4 className="author-name">{item.author}</h4>
                  <span className="author-city">{item.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow next" onClick={handleNext} aria-label="Next review">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="carousel-dots">
        {MOCK_TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>

      <style>{`
        .testimonials-section {
          margin: 4rem auto;
        }

        .text-center {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .testimonials-carousel-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .carousel-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          z-index: 5;
          transition: var(--transition);
        }

        .carousel-arrow:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .carousel-arrow.prev {
          margin-right: 1rem;
        }

        .carousel-arrow.next {
          margin-left: 1rem;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          flex-grow: 1;
        }

        .testimonial-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .quote-mark {
          font-size: 3rem;
          line-height: 1;
          color: var(--primary);
          font-family: serif;
          margin-bottom: 0.5rem;
        }

        .testimonial-quote {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-name {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .author-city {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .carousel-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.75rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #DDD;
          transition: var(--transition);
        }

        .dot.active {
          background: var(--primary);
          width: 20px;
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
