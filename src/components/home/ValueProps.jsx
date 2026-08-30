import React from 'react';
import { ShieldCheck, Tag, Calendar, Headset } from 'lucide-react';

export const ValueProps = () => {
  const props = [
    {
      icon: <ShieldCheck size={24} color="#FF385C" />,
      title: "Verified Homes",
      desc: "100% verified for your safety"
    },
    {
      icon: <Tag size={24} color="#FF385C" />,
      title: "Affordable Prices",
      desc: "Best options for every budget"
    },
    {
      icon: <Calendar size={24} color="#FF385C" />,
      title: "Hassle-free Booking",
      desc: "Easy booking with flexible stay"
    },
    {
      icon: <Headset size={24} color="#FF385C" />,
      title: "24/7 Support",
      desc: "We're here for you anytime"
    }
  ];

  return (
    <section className="value-props-section container">
      <div className="value-props-grid">
        {props.map((item, index) => (
          <div key={index} className="value-prop-card">
            <div className="prop-icon-circle">
              {item.icon}
            </div>
            <h3 className="prop-title">{item.title}</h3>
            <p className="prop-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .value-props-section {
          padding: 3rem 0;
        }

        .value-props-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-light);
        }

        .value-prop-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .prop-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #FFF0F3;
          border: 1px solid #FFE4E8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .prop-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .prop-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .value-props-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .value-props-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
