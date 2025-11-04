import {useState} from 'react';
import {NavLink} from '@remix-run/react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');

  const placeholderImage = '/landing-page-kitchen.png';

  const categories = [
    {id: 'all', name: 'All'},
    {id: 'kitchen', name: 'Kitchen'},
    {id: 'bathroom', name: 'Bathroom'},
    {id: 'living', name: 'Living Spaces'},
    {id: 'outdoor', name: 'Outdoor'},
  ];

  const projects = [
    {
      id: 1,
      title: 'Modern Kitchen Island',
      category: 'kitchen',
      description: 'Custom marble kitchen island with waterfall edges',
      image: placeholderImage,
      location: 'Beverly Hills, CA',
    },
    {
      id: 2,
      title: 'Luxury Bathroom Suite',
      category: 'bathroom',
      description: 'Full marble bathroom renovation with custom fixtures',
      image: placeholderImage,
      location: 'Manhattan, NY',
    },
    {
      id: 3,
      title: 'Living Room Fireplace',
      category: 'living',
      description: 'Custom marble fireplace surround with intricate detailing',
      image: placeholderImage,
      location: 'Miami, FL',
    },
    {
      id: 4,
      title: 'Outdoor Kitchen',
      category: 'outdoor',
      description: 'Weather-resistant marble outdoor kitchen installation',
      image: placeholderImage,
      location: 'Malibu, CA',
    },
    // Add more projects as needed
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="gallery">
      <div className="gallery-hero">
        <h1>Our Gallery</h1>
        <p>Explore our curated collection of custom marble installations</p>
      </div>

      <div className="gallery-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`gallery-category ${
              activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="gallery-item">
            <div className="gallery-item-image">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <div className="gallery-item-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="gallery-item-location">{project.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-cta">
        <h2>Ready to Create Your Masterpiece?</h2>
        <p>Schedule a consultation with our design experts</p>
        <NavLink to="/contact" className="gallery-cta-button">
          Schedule Consultation
        </NavLink>
      </div>
    </div>
  );
}
