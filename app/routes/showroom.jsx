import {useState} from 'react';
import {NavLink} from '@remix-run/react';

export default function Showroom() {
  const [activeCategory, setActiveCategory] = useState('all');

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
      image: '/images/showroom/kitchen-1.jpg',
      location: 'Beverly Hills, CA',
    },
    {
      id: 2,
      title: 'Luxury Bathroom Suite',
      category: 'bathroom',
      description: 'Full marble bathroom renovation with custom fixtures',
      image: '/images/showroom/bathroom-1.jpg',
      location: 'Manhattan, NY',
    },
    {
      id: 3,
      title: 'Living Room Fireplace',
      category: 'living',
      description: 'Custom marble fireplace surround with intricate detailing',
      image: '/images/showroom/living-1.jpg',
      location: 'Miami, FL',
    },
    {
      id: 4,
      title: 'Outdoor Kitchen',
      category: 'outdoor',
      description: 'Weather-resistant marble outdoor kitchen installation',
      image: '/images/showroom/outdoor-1.jpg',
      location: 'Malibu, CA',
    },
    // Add more projects as needed
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="showroom">
      <div className="showroom-hero">
        <h1>Our Showroom</h1>
        <p>Explore our curated collection of custom marble installations</p>
      </div>

      <div className="showroom-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`showroom-category ${
              activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="showroom-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="showroom-item">
            <div className="showroom-item-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="showroom-item-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="showroom-item-location">{project.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="showroom-cta">
        <h2>Ready to Create Your Masterpiece?</h2>
        <p>Schedule a consultation with our design experts</p>
        <NavLink to="/contact" className="showroom-cta-button">
          Schedule Consultation
        </NavLink>
      </div>
    </div>
  );
}
