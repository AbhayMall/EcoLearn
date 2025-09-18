import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export default function Home() {
  useEffect(() => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const handleMobileMenu = () => {
      navLinks?.classList.toggle('active');
      navActions?.classList.toggle('active');
    };
    mobileMenuBtn?.addEventListener('click', handleMobileMenu);

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDown = (e) => {
      isDown = true;
      startX = e.pageX - testimonialSlider.offsetLeft;
      scrollLeft = testimonialSlider.scrollLeft;
    };
    const mouseLeave = () => (isDown = false);
    const mouseUp = () => (isDown = false);
    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialSlider.offsetLeft;
      const walk = (x - startX) * 2;
      testimonialSlider.scrollLeft = scrollLeft - walk;
    };

    testimonialSlider?.addEventListener('mousedown', mouseDown);
    testimonialSlider?.addEventListener('mouseleave', mouseLeave);
    testimonialSlider?.addEventListener('mouseup', mouseUp);
    testimonialSlider?.addEventListener('mousemove', mouseMove);

    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    const showError = (input, message) => {
      const formGroup = input.parentElement;
      const errorDiv =
        formGroup.querySelector('.error-message') ||
        document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = '#c62828';
      errorDiv.style.fontSize = '0.9rem';
      errorDiv.style.marginTop = '0.5rem';
      errorDiv.textContent = message;

      if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
      }
      input.style.borderColor = '#c62828';
    };
    const clearError = (input) => {
      const formGroup = input.parentElement;
      const errorDiv = formGroup.querySelector('.error-message');
      if (errorDiv) {
        formGroup.removeChild(errorDiv);
      }
      input.style.borderColor = '#e0e0e0';
    };
    const isValidEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      let isValid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (isValid) {
        alert('Form submitted successfully!');
        contactForm.reset();
      }
    };

    contactForm?.addEventListener('submit', handleFormSubmit);

    // Animation on scroll
    function initScrollAnimations() {
      const animatedElements = document.querySelectorAll(
        '.feature-card, .course-card, .testimonial'
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = 1;
              entry.target.style.transform = 'translateY(0)';
            }
          });
        },
        { threshold: 0.1 }
      );

      animatedElements.forEach((element) => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition =
          'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
      });
    }
    initScrollAnimations();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileMenuBtn?.removeEventListener('click', handleMobileMenu);
      testimonialSlider?.removeEventListener('mousedown', mouseDown);
      testimonialSlider?.removeEventListener('mouseleave', mouseLeave);
      testimonialSlider?.removeEventListener('mouseup', mouseUp);
      testimonialSlider?.removeEventListener('mousemove', mouseMove);
      contactForm?.removeEventListener('submit', handleFormSubmit);
    };
  }, []);


  return (
    <div className="landing-page">
      <div className="floating-leaves">
        <span className="leaf-float" style={{ left: '8%', top: '20%' }}>🍃</span>
        <span className="leaf-float-delayed" style={{ left: '18%', top: '60%' }}>🍀</span>
        <span className="leaf-float-slow" style={{ left: '78%', top: '30%' }}>🌿</span>
        <span className="leaf-float-fast" style={{ left: '65%', top: '75%' }}>🍃</span>
        <span className="icon-float" style={{ left: '35%', top: '40%' }}>💧</span>
        <span className="icon-float-delayed" style={{ left: '85%', top: '15%' }}>☀️</span>
        <span className="eco-float" style={{ left: '55%', top: '55%' }}>♻️</span>
        <span className="eco-float-delayed" style={{ left: '25%', top: '75%' }}>🌎</span>
      </div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🌱</span>
            EcoLearn
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          
          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
          
          <button className="mobile-menu-btn">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Learn. Play. Earn ecoPoints. Make an impact.</h1>
            <p className="hero-description">Join our community of eco-warriors and transform your knowledge into action. Our gamified platform makes sustainability education engaging and rewarding.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Start Learning</Link>
              <Link to="/courses" className="btn btn-outline">Explore Courses</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">ecoPoints Earned</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">Interactive Learning Experience</div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose EcoLearn?</h2>
            <p>Our innovative approach to sustainability education combines learning with real-world impact.</p>
          </div>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Gamified Learning</h3>
              <p>Unlock badges, climb leaderboards, and compete in eco challenges to make learning fun and engaging.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Learn by Doing</h3>
              <p>Courses with materials, quizzes, and assignments guided by expert teachers and environmental specialists.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Make an Impact</h3>
              <p>Convert your ecoPoints into real-world actions like tree planting or beach cleanups through our partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about">
        <div className="container about-container">
          <div className="about-content">
            <h2>Transforming Education for a Sustainable Future</h2>
            <p>EcoLearn was founded in 2020 with a mission to make sustainability education accessible, engaging, and impactful for everyone. We believe that learning about our planet should be as exciting as it is important.</p>
            <p>Our platform combines cutting-edge educational technology with gamification elements to create an immersive learning experience that drives real behavior change.</p>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              <div className="stat">
                <div className="stat-number">87%</div>
                <div className="stat-label">Reported Behavior Change</div>
              </div>
              <div className="stat">
                <div className="stat-number">15</div>
                <div className="stat-label">Environmental Partners</div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="about-image-placeholder">Our Community in Action</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Popular Courses</h2>
            <p>Explore our most popular sustainability courses and start your eco-journey today.</p>
          </div>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-image">Climate Science Basics</div>
              <div className="course-content">
                <h3>Climate Science Basics</h3>
                <p>Understand the fundamentals of climate change and its impacts on our planet.</p>
                <div className="course-meta">
                  <span className="course-level">Beginner</span>
                  <span className="course-rating">★★★★★ (4.9)</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-image">Sustainable Living</div>
              <div className="course-content">
                <h3>Sustainable Living</h3>
                <p>Learn practical ways to reduce your environmental footprint in daily life.</p>
                <div className="course-meta">
                  <span className="course-level">Intermediate</span>
                  <span className="course-rating">★★★★☆ (4.7)</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-image">Renewable Energy</div>
              <div className="course-content">
                <h3>Renewable Energy</h3>
                <p>Explore the technologies powering our transition to a clean energy future.</p>
                <div className="course-meta">
                  <span className="course-level">Advanced</span>
                  <span className="course-rating">★★★★★ (4.8)</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/courses" className="btn btn-primary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials">
        <div className="container testimonials-container">
          <div className="section-title">
            <h2>What Our Learners Say</h2>
            <p>Join thousands of satisfied learners who have transformed their understanding of sustainability.</p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"EcoLearn made understanding complex environmental issues so engaging. The gamification elements kept me motivated throughout the courses!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>Jane Doe</h4>
                  <p>Environmental Science Student</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"I've been able to implement so many sustainable practices at home thanks to EcoLearn. The courses are practical and immediately applicable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <h4>John Smith</h4>
                  <p>Homeowner & Parent</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"As a teacher, I've incorporated EcoLearn into my curriculum. My students are more engaged than ever with environmental topics!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">ES</div>
                <div className="author-info">
                  <h4>Emma Wilson</h4>
                  <p>High School Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" id="contact">
        <div className="container">
          <div className="section-title">
            <h2>Get In Touch</h2>
            <p>Have questions or want to learn more? Reach out to our team.</p>
          </div>
          <div className="contact-container">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>info@ecolearn.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>123 Green Street, Eco City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Your email" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-col">
            <h3>EcoLearn</h3>
            <p>Making sustainability education engaging, accessible, and impactful for everyone.</p>
            <div className="footer-social">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">t</a>
              <a href="#" className="social-icon">in</a>
              <a href="#" className="social-icon">ig</a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">Partnerships</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates and eco-tips.</p>
            <form>
              <div className="form-group">
                <input type="email" placeholder="Your email address" />
              </div>
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EcoLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

