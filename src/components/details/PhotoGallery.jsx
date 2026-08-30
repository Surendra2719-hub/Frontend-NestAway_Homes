import React, { useState } from 'react';
import { Grid, X } from 'lucide-react';

export const PhotoGallery = ({ images = [], title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="gallery-section">
      <div className="gallery-grid-layout">
        {/* Main Big Photo */}
        <div className="main-photo-col" onClick={() => { setSelectedPhoto(0); setIsModalOpen(true); }}>
          <img src={displayImages[0]} alt={title} className="gallery-img" />
        </div>

        {/* 4 Secondary Grid Photos */}
        <div className="secondary-photos-grid">
          {displayImages.slice(1, 5).map((img, idx) => (
            <div 
              key={idx} 
              className="secondary-photo-item"
              onClick={() => { setSelectedPhoto(idx + 1); setIsModalOpen(true); }}
            >
              <img src={img} alt={`${title} ${idx + 2}`} className="gallery-img" />
            </div>
          ))}

          <button className="view-all-photos-btn" onClick={() => setIsModalOpen(true)}>
            <Grid size={16} />
            <span>View all photos</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div className="gallery-modal-overlay">
          <button className="close-lightbox-btn" onClick={() => setIsModalOpen(false)}>
            <X size={28} />
          </button>
          
          <div className="lightbox-content">
            <img src={displayImages[selectedPhoto]} alt="Property photo" className="lightbox-img" />
            
            <div className="lightbox-thumbnails">
              {displayImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Thumb"
                  className={`lightbox-thumb ${selectedPhoto === idx ? 'active' : ''}`}
                  onClick={() => setSelectedPhoto(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-section {
          position: relative;
          margin-bottom: 2rem;
        }

        .gallery-grid-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0.75rem;
          height: 420px;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .main-photo-col {
          height: 100%;
          cursor: pointer;
          overflow: hidden;
        }

        .secondary-photos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 0.75rem;
          height: 100%;
          position: relative;
        }

        .secondary-photo-item {
          height: 100%;
          cursor: pointer;
          overflow: hidden;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .main-photo-col:hover .gallery-img,
        .secondary-photo-item:hover .gallery-img {
          transform: scale(1.03);
        }

        .view-all-photos-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: var(--shadow-sm);
        }

        .gallery-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .close-lightbox-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          color: white;
        }

        .lightbox-content {
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-img {
          max-height: 520px;
          width: auto;
          max-width: 100%;
          border-radius: var(--radius-md);
          object-fit: contain;
        }

        .lightbox-thumbnails {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          overflow-x: auto;
        }

        .lightbox-thumb {
          width: 70px;
          height: 50px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          opacity: 0.6;
          cursor: pointer;
        }

        .lightbox-thumb.active {
          opacity: 1;
          border: 2px solid var(--primary);
        }

        @media (max-width: 768px) {
          .gallery-grid-layout {
            grid-template-columns: 1fr;
            height: 280px;
          }
          .secondary-photos-grid {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
