/* ==========================================================================
   Seven Starr Trucking LLC - Javascript Logic Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. Page Loading Animation
     ========================================================================== */
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
        document.body.style.overflow = 'initial';
      }
    }, 1200); // Premium visual duration
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  /* ==========================================================================
     2. Sticky Header & Mobile Navigation Menu
     ========================================================================== */
  const header = document.querySelector('.main-header');
  let headerTicking = false;
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active class
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     3. 3D Truck Model Rotation Interaction
     ========================================================================== */
  const truckObject = document.querySelector('.truck-3d-object');
  const truckWrapper = document.querySelector('.truck-3d-wrapper');

  if (truckObject && truckWrapper) {
    let rect = null;
    let wrapperOffset = truckWrapper.offsetTop;
    let windowHeight = window.innerHeight;
    let scrollTicking = false;

    // Cache metrics to avoid layout thrashing on scroll/mousemove
    const updateMetrics = () => {
      if (truckWrapper) {
        rect = truckWrapper.getBoundingClientRect();
        wrapperOffset = truckWrapper.offsetTop;
        windowHeight = window.innerHeight;
      }
    };

    // Initialize metrics
    updateMetrics();

    // Re-cache metrics on resize or when user first enters the 3D area
    window.addEventListener('resize', updateMetrics, { passive: true });
    truckWrapper.addEventListener('mouseenter', updateMetrics, { passive: true });

    // 3D rotation on scroll (throttled with requestAnimationFrame)
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          if (scrollPos > wrapperOffset - windowHeight && scrollPos < wrapperOffset + 400) {
            const rotationY = -38 + (scrollPos - wrapperOffset) * 0.1;
            truckObject.style.transform = `rotateX(-16deg) rotateY(${rotationY}deg) rotateZ(0deg)`;
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // 3D rotation on mouse move (throttled with requestAnimationFrame and cached rect)
    let mouseTicking = false;
    truckWrapper.addEventListener('mousemove', (e) => {
      if (!mouseTicking) {
        window.requestAnimationFrame(() => {
          if (!rect) rect = truckWrapper.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          const rotY = -38 + (x / rect.width) * 45;
          const rotX = -16 - (y / rect.height) * 30;
          
          truckObject.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(0deg)`;
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    }, { passive: true });

    truckWrapper.addEventListener('mouseleave', () => {
      window.requestAnimationFrame(() => {
        truckObject.style.transform = `rotateX(-16deg) rotateY(-38deg) rotateZ(0deg)`;
      });
    });
  }

  /* ==========================================================================
     4. Statistics Counter Animation (Scroll Triggered)
     ========================================================================== */
  const statsSection = document.querySelector('.hero-stats-grid');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds animation
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCount = () => {
        current += increment;
        if (current < target) {
          if (target === 4) {
            stat.textContent = Math.floor(current) + '+';
          } else if (target === 99) {
            stat.textContent = Math.floor(current) + '%';
          } else if (target === 24) {
            stat.textContent = Math.floor(current) + '/7';
          } else {
            stat.textContent = Math.floor(current);
          }
          requestAnimationFrame(updateCount);
        } else {
          if (target === 4) {
            stat.textContent = target + '+';
          } else if (target === 99) {
            stat.textContent = target + '%';
          } else if (target === 24) {
            stat.textContent = target + '/7';
          } else {
            stat.textContent = target;
          }
        }
      };
      updateCount();
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  /* ==========================================================================
     5. Scroll Entrance Animations (Fade Ins)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.service-card, .feature-card, .gallery-item, .section-title, .about-content, .truck-3d-wrapper, .recruitment-banner, .quote-grid');
  
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Stop observing once animated
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => {
    scrollObserver.observe(el);
  });

  /* ==========================================================================
     6. Testimonials Reviews Carousel
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-review-btn');
  const nextBtn = document.getElementById('next-review-btn');
  const dotsContainer = document.getElementById('slider-dots');
  
  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = Array.from(track.children);
    let currentIndex = 0;
    let autoPlayTimer;

    // Create dot indicators
    cards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const moveToSlide = (index) => {
      currentIndex = index;
      updateSlider();
      resetAutoplay();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateSlider();
    };

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Autoplay
    const startAutoplay = () => {
      autoPlayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(autoPlayTimer);
      startAutoplay();
    };

    // Pause autoplay on mouse hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ==========================================================================
     7. FAQ Accordion Logic
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQs
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     8. Leaflet.js Interactive Logistics Map
     ========================================================================== */
  // Initial Mock Shipment Database Coordinates & Statuses
  const activeShipments = {
    'STARR-777': {
      id: 'STARR-777',
      status: 'transit',
      progress: 65, // percentage
      origin: 'Hialeah, FL',
      destination: 'Chicago, IL',
      originCoords: [25.8859, -80.2784],
      destCoords: [41.8781, -87.6298],
      route: [
        [25.8859, -80.2784], // Hialeah, FL
        [30.3322, -81.6557], // Jacksonville, FL
        [33.7490, -84.3880], // Atlanta, GA
        [36.1627, -86.7816], // Nashville, TN
        [39.7684, -86.1581], // Indianapolis, IN
        [41.8781, -87.6298]  // Chicago, IL
      ]
    },
    'STARR-999': {
      id: 'STARR-999',
      status: 'delivered',
      progress: 100,
      origin: 'Los Angeles, CA',
      destination: 'Hialeah, FL',
      originCoords: [34.0522, -118.2437],
      destCoords: [25.8859, -80.2784],
      route: [
        [34.0522, -118.2437], // Los Angeles, CA
        [33.4484, -112.0740], // Phoenix, AZ
        [31.7619, -106.4850], // El Paso, TX
        [29.4241, -98.4936],  // San Antonio, TX
        [29.7604, -95.3698],  // Houston, TX
        [30.4515, -91.1871],  // Baton Rouge, LA
        [30.6954, -88.0399],  // Mobile, AL
        [30.4383, -84.2807],  // Tallahassee, FL
        [25.8859, -80.2784]   // Hialeah, FL (Terminal)
      ]
    }
  };

  let map;
  let truckMarkers = {};
  let routeLines = {};

  // Setup Leaflet map
  const initLogisticsMap = () => {
    const mapElement = document.getElementById('logistics-map');
    if (!mapElement) return;

    // Initialize Map centered on the USA
    map = L.map('logistics-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([37.8, -96.0], 4);

    // Apply CartoDB Dark Matter tiles (premium dark mode map styling)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add Hialeah Terminal Marker
    const terminalIcon = L.divIcon({
      className: 'custom-terminal-marker',
      html: `<div style="background-color: #0A192F; border: 2px solid #FF6B35; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px #FF6B35;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([25.8859, -80.2784], { icon: terminalIcon })
      .addTo(map)
      .bindPopup('<strong style="color:#FF6B35">Seven Starr Terminal</strong><br>19900 NW 86th CT, Hialeah, FL');

    // Draw lines and animate trucks
    drawShipmentRoutes();
    startTruckSimulation();
  };

  // Function to calculate exact coordinate along a polyline based on completion progress
  const getCoordinateAtProgress = (route, progressPercent) => {
    if (progressPercent >= 100) return route[route.length - 1];
    if (progressPercent <= 0) return route[0];

    const totalSections = route.length - 1;
    const progressFraction = progressPercent / 100;
    
    // Find which section the progress falls in
    const sectionFloat = progressFraction * totalSections;
    const sectionIndex = Math.floor(sectionFloat);
    const sectionProgress = sectionFloat - sectionIndex;

    const startNode = route[sectionIndex];
    const endNode = route[sectionIndex + 1];

    // Linear interpolation
    const lat = startNode[0] + (endNode[0] - startNode[0]) * sectionProgress;
    const lng = startNode[1] + (endNode[1] - startNode[1]) * sectionProgress;

    return [lat, lng];
  };

  // Draw static lines for active shipments
  const drawShipmentRoutes = () => {
    Object.values(activeShipments).forEach(shipment => {
      // Draw Polyline Route
      const polyline = L.polyline(shipment.route, {
        color: '#FF6B35',
        weight: 2,
        opacity: 0.45,
        dashArray: '5, 8'
      }).addTo(map);

      routeLines[shipment.id] = polyline;

      // Draw custom truck marker
      const initialCoords = getCoordinateAtProgress(shipment.route, shipment.progress);
      
      const truckIcon = L.divIcon({
        className: `custom-truck-marker-${shipment.id}`,
        html: `
          <div class="map-truck-pin" style="background-color: #FF6B35; border: 2px solid #E6F1FF; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 12px #FF6B35; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#020C1B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><rect width="16" height="10" x="2" y="11" rx="2"/><path d="M12 2v9"/><path d="M10 2h3"/><path d="M16 11h3l3 4v5a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(initialCoords, { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<strong>Shipment Reference: ${shipment.id}</strong><br>Status: ${shipment.status.toUpperCase()}<br>Route: ${shipment.origin} &rarr; ${shipment.destination}`);

      truckMarkers[shipment.id] = marker;
    });
  };

  // Simulate OTR truck movement (vibrate/glide trucks slightly for premium dynamic realism)
  const startTruckSimulation = () => {
    let tick = 0;
    setInterval(() => {
      tick += 0.05;
      Object.values(activeShipments).forEach(shipment => {
        if (shipment.status === 'transit') {
          // Add a very small wave oscillation to simulate highway motion jitter
          const currentProgress = shipment.progress;
          const coords = getCoordinateAtProgress(shipment.route, currentProgress);
          
          // Apply tiny visual offset
          const offsetLat = coords[0] + Math.sin(tick) * 0.015;
          const offsetLng = coords[1] + Math.cos(tick) * 0.015;

          if (truckMarkers[shipment.id]) {
            truckMarkers[shipment.id].setLatLng([offsetLat, offsetLng]);
          }
        }
      });
    }, 150);
  };

  initLogisticsMap();

  /* ==========================================================================
     9. Live Freight Tracking Query System
     ========================================================================== */
  const trackingInput = document.getElementById('tracking-input');
  const trackingSearchBtn = document.getElementById('tracking-search-btn');
  const trackingResultBox = document.getElementById('tracking-result-box');

  const stepOrdered = document.getElementById('step-ordered');
  const stepLoaded = document.getElementById('step-loaded');
  const stepTransit = document.getElementById('step-transit');
  const stepDelivered = document.getElementById('step-delivered');

  const trackerStatusBadge = document.getElementById('tracker-status-badge');
  const trackerRefId = document.getElementById('tracker-ref-id');
  const trackerOrigin = document.getElementById('tracker-origin');
  const trackerDestination = document.getElementById('tracker-destination');
  const trackerPingTime = document.getElementById('tracker-ping-time');

  const executeTrackQuery = () => {
    const query = trackingInput.value.trim().toUpperCase();
    if (!query) {
      showToast('Error', 'Please enter a tracking code.', 'shield-alert');
      return;
    }

    const shipment = activeShipments[query];

    if (shipment) {
      // Show tracking UI
      trackingResultBox.classList.remove('hidden');
      
      // Update HTML values
      trackerRefId.textContent = shipment.id;
      trackerOrigin.textContent = shipment.origin;
      trackerDestination.textContent = shipment.destination;
      trackerPingTime.textContent = 'Just now';

      // Status Badge Style
      trackerStatusBadge.className = 'badge';
      if (shipment.status === 'delivered') {
        trackerStatusBadge.classList.add('badge-accent');
        trackerStatusBadge.textContent = 'Delivered';
      } else if (shipment.status === 'transit') {
        trackerStatusBadge.textContent = 'In Transit';
      } else {
        trackerStatusBadge.textContent = shipment.status.toUpperCase();
      }

      // Reset Timeline styles
      const steps = [stepOrdered, stepLoaded, stepTransit, stepDelivered];
      steps.forEach(step => {
        step.className = 'timeline-step';
      });

      // Highlight timeline based on status
      if (shipment.status === 'ordered') {
        stepOrdered.classList.add('active');
      } else if (shipment.status === 'loaded') {
        stepOrdered.classList.add('completed');
        stepLoaded.classList.add('active');
      } else if (shipment.status === 'transit') {
        stepOrdered.classList.add('completed');
        stepLoaded.classList.add('completed');
        stepTransit.classList.add('active');
      } else if (shipment.status === 'delivered') {
        stepOrdered.classList.add('completed');
        stepLoaded.classList.add('completed');
        stepTransit.classList.add('completed');
        stepDelivered.classList.add('completed');
      }

      // Map Focus Zoom onto that truck marker
      if (map && truckMarkers[shipment.id]) {
        const coords = getCoordinateAtProgress(shipment.route, shipment.progress);
        map.setView(coords, 6, { animate: true, duration: 1.5 });
        
        setTimeout(() => {
          truckMarkers[shipment.id].openPopup();
        }, 1600);
      }

      showToast('Tracking Found', `Loaded logistics details for ${shipment.id}`, 'navigation');

    } else {
      trackingResultBox.classList.add('hidden');
      showToast('Query Failed', 'Invalid reference code. Try STARR-777 or STARR-999.', 'shield-alert');
    }
  };

  if (trackingSearchBtn) {
    trackingSearchBtn.addEventListener('click', executeTrackQuery);
    trackingInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executeTrackQuery();
    });
  }

  /* ==========================================================================
     10. Client Storage & Form Handlers (Mock Database Persistence)
     ========================================================================== */
  
  // Custom File Inputs design labels helper
  const fileInputs = document.querySelectorAll('.file-input-hidden');
  fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const fileName = e.target.files[0]?.name || 'Upload Document';
      const labelText = input.nextElementSibling.querySelector('.file-label-text');
      if (labelText) {
        labelText.textContent = fileName;
        labelText.style.color = '#FF6B35';
      }
    });
  });

  // Database initialization
  if (!localStorage.getItem('seven_starr_drivers')) {
    localStorage.setItem('seven_starr_drivers', JSON.stringify([]));
  }
  if (!localStorage.getItem('seven_starr_quotes')) {
    localStorage.setItem('seven_starr_quotes', JSON.stringify([]));
  }

  // Driver App Submission
  const driverForm = document.getElementById('driver-application-form');
  if (driverForm) {
    driverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newApp = {
        id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString(),
        name: document.getElementById('driver-name').value,
        company: document.getElementById('driver-company').value || 'N/A',
        phone: document.getElementById('driver-phone').value,
        email: document.getElementById('driver-email').value,
        location: document.getElementById('driver-location').value,
        truckNo: document.getElementById('driver-truck-no').value || 'N/A',
        truckType: document.getElementById('driver-truck-type').value,
        experience: document.getElementById('driver-experience').value,
        mc: document.getElementById('driver-mc').value || 'N/A',
        dot: document.getElementById('driver-dot').value || 'N/A',
        states: document.getElementById('driver-states').value,
        cdlFile: document.getElementById('driver-cdl').files[0]?.name || 'license.pdf',
        insFile: document.getElementById('driver-insurance').files[0]?.name || 'insurance.pdf',
        notes: document.getElementById('driver-notes').value || 'N/A',
        status: 'pending'
      };

      // Save to localStorage DB
      const apps = JSON.parse(localStorage.getItem('seven_starr_drivers'));
      apps.push(newApp);
      localStorage.setItem('seven_starr_drivers', JSON.stringify(apps));

      // Append backend identifier
      newApp.type = 'driver';

      // Submit directly to FormSubmit API from client-side
      fetch('https://formsubmit.co/ajax/sultan_mamun@hotmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: "New Driver Lease Application: " + newApp.name,
          name: newApp.name,
          email: newApp.email,
          phone: newApp.phone,
          location: newApp.location,
          equipment: newApp.truckType + " (Truck #" + newApp.truckNo + ")",
          experience: newApp.experience + " Years",
          mc_dot: "MC: " + newApp.mc + " / DOT: " + newApp.dot,
          operating_states: newApp.states,
          documents: "CDL: " + newApp.cdlFile + " / Insurance: " + newApp.insFile,
          notes: newApp.notes
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          showToast('Email Transmitted', 'Forms data dispatched to sultan_mamun@hotmail.com!', 'mail');
        }
      })
      .catch(err => {
        console.error("FormSubmit API Error:", err);
      });

      // Reset form
      driverForm.reset();
      fileInputs.forEach(input => {
        const labelText = input.nextElementSibling.querySelector('.file-label-text');
        if (labelText) {
          if (input.id === 'driver-cdl') labelText.textContent = 'CDL_License.pdf';
          if (input.id === 'driver-insurance') labelText.textContent = 'Insurance_COI.pdf';
          labelText.style.color = '#8892B0';
        }
      });

      // Show Notifications
      showToast('CDL Authenticated', 'Documents checked, details logged to server.', 'shield-check');
      
      setTimeout(() => {
        showToast('Notification Direct', 'Email alert sent to Sultan Mamun (sultan_mamun@hotmail.com)', 'mail');
      }, 1000);

      setTimeout(() => {
        showToast('Confirmation Dispatch', `Applicant copy sent to ${newApp.email}`, 'mail');
      }, 2000);

      // Refresh Dashboard Table if open
      renderAdminTables();
    });
  }

  // Shipper Quote Submission
  const shipperForm = document.getElementById('shipper-quote-form');
  if (shipperForm) {
    shipperForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newQuote = {
        id: 'QTE-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString(),
        company: document.getElementById('quote-company').value,
        contact: document.getElementById('quote-contact').value,
        phone: document.getElementById('quote-phone').value,
        email: document.getElementById('quote-email').value,
        pickup: document.getElementById('quote-pickup').value,
        delivery: document.getElementById('quote-delivery').value,
        freight: document.getElementById('quote-freight').value,
        weight: document.getElementById('quote-weight').value,
        trailer: document.getElementById('quote-trailer').value,
        notes: document.getElementById('quote-notes').value || 'N/A'
      };

      // Save to localStorage DB
      const quotes = JSON.parse(localStorage.getItem('seven_starr_quotes'));
      quotes.push(newQuote);
      localStorage.setItem('seven_starr_quotes', JSON.stringify(quotes));

      // Append backend identifier
      newQuote.type = 'quote';

      // Submit directly to FormSubmit API from client-side
      fetch('https://formsubmit.co/ajax/sultan_mamun@hotmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: "New Shipper Freight Quote Request: " + newQuote.company,
          company: newQuote.company,
          contact: newQuote.contact,
          phone: newQuote.phone,
          email: newQuote.email,
          pickup: newQuote.pickup,
          delivery: newQuote.delivery,
          freight: newQuote.freight,
          weight: newQuote.weight + " lbs",
          trailer: newQuote.trailer,
          notes: newQuote.notes
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          showToast('Email Transmitted', 'Quote inquiry dispatched to sultan_mamun@hotmail.com!', 'mail');
        }
      })
      .catch(err => {
        console.error("FormSubmit API Error:", err);
      });

      // Reset form
      shipperForm.reset();

      // Show Notifications
      showToast('Quote Received', 'Lane calculation processed.', 'calculator');

      setTimeout(() => {
        showToast('Notification Direct', 'Quote requested alert sent to CEO Sultan Mamun (sultan_mamun@hotmail.com).', 'mail');
      }, 1000);

      setTimeout(() => {
        showToast('Confirmation Dispatch', `Freight quote copy sent to ${newQuote.email}`, 'mail');
      }, 2000);

      // Refresh Dashboard Table
      renderAdminTables();
    });
  }

  // Contact Page Form Submission
  const contactForm = document.getElementById('contact-email-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newContact = {
        type: 'contact',
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
      };

      // Submit directly to FormSubmit API from client-side
      fetch('https://formsubmit.co/ajax/sultan_mamun@hotmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: "General Web Query: " + newContact.subject,
          name: newContact.name,
          email: newContact.email,
          subject_field: newContact.subject,
          message: newContact.message
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          showToast('Email Transmitted', 'Message dispatched to sultan_mamun@hotmail.com!', 'mail');
        }
      })
      .catch(err => {
        console.error("FormSubmit API Error:", err);
      });

      const email = document.getElementById('contact-email').value;
      contactForm.reset();

      showToast('Message Transmitted', 'Your query has been logged to the main terminal.', 'check-circle-2');
      setTimeout(() => {
        showToast('Notification Direct', `Confirmation copy sent to ${email}`, 'mail');
      }, 1200);
    });
  }

  /* ==========================================================================
     11. Sliding Admin Dashboard Panel
     ========================================================================== */
  const adminOverlay = document.getElementById('admin-dashboard-overlay');
  const adminToggleBtn = document.getElementById('admin-toggle-btn');
  const adminCloseBtn = document.getElementById('admin-close-btn');
  const adminFooterTrigger = document.getElementById('admin-trigger-footer');
  
  const adminLoginBox = document.getElementById('admin-login-box');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminContentBox = document.getElementById('admin-content-box');
  const loginErrorMsg = document.getElementById('login-error-msg');

  // Toggle Admin Panel Slide state
  const openAdminPanel = () => {
    adminOverlay.classList.remove('hidden');
    setTimeout(() => {
      adminOverlay.classList.add('active');
    }, 50);

    // Check existing auth state
    if (sessionStorage.getItem('seven_starr_authorized') === 'true') {
      adminLoginBox.classList.add('hidden');
      adminContentBox.classList.remove('hidden');
      renderAdminTables();
    } else {
      adminLoginBox.classList.remove('hidden');
      adminContentBox.classList.add('hidden');
    }
  };

  const closeAdminPanel = () => {
    adminOverlay.classList.remove('active');
    setTimeout(() => {
      adminOverlay.classList.add('hidden');
    }, 400);
  };

  if (adminToggleBtn) adminToggleBtn.addEventListener('click', openAdminPanel);
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminPanel);
  if (adminFooterTrigger) {
    adminFooterTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminPanel();
    });
  }

  // Authorize Login Form Submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value;
      const pass = document.getElementById('admin-password').value;

      if (user === 'admin' && pass === 'sevenstarr') {
        sessionStorage.setItem('seven_starr_authorized', 'true');
        loginErrorMsg.classList.add('hidden');
        adminLoginBox.classList.add('hidden');
        adminContentBox.classList.remove('hidden');
        
        showToast('Access Approved', 'Welcome back, CEO Sultan Mamun.', 'shield');
        renderAdminTables();
      } else {
        loginErrorMsg.classList.remove('hidden');
        showToast('Authorized Denied', 'Credential mismatch.', 'shield-alert');
      }
    });
  }

  // Tab Switching
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const paneId = 'tab-' + btn.getAttribute('data-tab');
      document.getElementById(paneId).classList.add('active');
    });
  });

  // Populate Admin Tables with Local Storage mock database records
  const renderAdminTables = () => {
    // 1. Load Drivers
    const driversTbody = document.getElementById('driver-apps-tbody');
    const drivers = JSON.parse(localStorage.getItem('seven_starr_drivers')) || [];
    document.getElementById('count-driver-apps').textContent = drivers.length;
    
    if (drivers.length === 0) {
      driversTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color:#8892B0;">No driver applications submitted yet.</td></tr>`;
    } else {
      driversTbody.innerHTML = '';
      drivers.forEach((app, index) => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = 'status-pending';
        if (app.status === 'approved') statusBadgeClass = 'status-approved';
        if (app.status === 'rejected') statusBadgeClass = 'status-rejected';

        tr.innerHTML = `
          <td>${app.date}</td>
          <td>
            <strong>${app.name}</strong><br>
            <span style="font-size:11px">${app.email} | ${app.phone}</span>
          </td>
          <td>${app.location}</td>
          <td>${app.truckType}</td>
          <td>${app.experience} Yrs</td>
          <td>
            <a href="#" style="color:#FF6B35; text-decoration:underline" class="mock-doc-click" data-file="${app.cdlFile}">${app.cdlFile}</a><br>
            <a href="#" style="color:#FF6B35; text-decoration:underline" class="mock-doc-click" data-file="${app.insFile}">${app.insFile}</a>
          </td>
          <td><span class="badge-status ${statusBadgeClass}">${app.status}</span></td>
          <td>
            ${app.status === 'pending' ? `
              <button class="btn btn-primary btn-sm approve-app-btn" data-index="${index}" style="padding: 4px 10px; font-size:11px; margin-bottom:4px; display:block; width:100%">Approve</button>
              <button class="btn btn-outline btn-sm reject-app-btn" data-index="${index}" style="padding: 4px 10px; font-size:11px; display:block; width:100%">Reject</button>
            ` : `<span style="color:#8892B0">Processed</span>`}
          </td>
        `;
        driversTbody.appendChild(tr);
      });

      // Attach button events
      document.querySelectorAll('.approve-app-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          updateAppStatus(index, 'approved');
        });
      });
      document.querySelectorAll('.reject-app-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          updateAppStatus(index, 'rejected');
        });
      });
    }

    // 2. Load Shipper Quotes
    const quotesTbody = document.getElementById('shipper-quotes-tbody');
    const quotes = JSON.parse(localStorage.getItem('seven_starr_quotes')) || [];
    document.getElementById('count-shipper-quotes').textContent = quotes.length;

    if (quotes.length === 0) {
      quotesTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color:#8892B0;">No quote inquiries submitted yet.</td></tr>`;
    } else {
      quotesTbody.innerHTML = '';
      quotes.forEach((qte) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${qte.date}</td>
          <td><strong>${qte.company}</strong></td>
          <td>
            ${qte.contact}<br>
            <span style="font-size:11px">${qte.email} | ${qte.phone}</span>
          </td>
          <td>
            Origin: ${qte.pickup}<br>
            Dest: ${qte.delivery}
          </td>
          <td>${parseInt(qte.weight, 10).toLocaleString()} lbs / ${qte.freight}</td>
          <td>${qte.trailer}</td>
          <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${qte.notes}</td>
          <td>
            <button class="btn btn-primary btn-sm send-quote-btn" style="padding: 4px 10px; font-size:11px;">Send Rate Sheet</button>
          </td>
        `;
        quotesTbody.appendChild(tr);
      });
      
      document.querySelectorAll('.send-quote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          showToast('Logistics Alert', 'Rate sheet estimate emailed to broker coordinator!', 'mail');
        });
      });
    }

    // Attach mock file document click handler
    document.querySelectorAll('.mock-doc-click').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filename = link.getAttribute('data-file');
        showToast('Document Viewer', `Downloading document copy: ${filename}`, 'download');
      });
    });
  };

  const updateAppStatus = (index, status) => {
    const apps = JSON.parse(localStorage.getItem('seven_starr_drivers'));
    apps[index].status = status;
    localStorage.setItem('seven_starr_drivers', JSON.stringify(apps));
    
    showToast('Driver Status Updated', `Application status changed to ${status.toUpperCase()}`, 'check-circle-2');
    
    // Send mock mail alert to driver
    setTimeout(() => {
      showToast('Notification Dispatch', `Email sent to ${apps[index].email}: "Your application is ${status}."`, 'mail');
    }, 1200);

    renderAdminTables();
  };

  // 3. Tracking Status Manager Actions
  const updateTrackingBtn = document.getElementById('admin-update-tracking-btn');
  const selectTruck = document.getElementById('admin-select-truck');
  const selectStatus = document.getElementById('admin-truck-status');
  const progressSlider = document.getElementById('admin-truck-progress');
  const progressVal = document.getElementById('admin-progress-value');
  const trackingAlert = document.getElementById('tracking-update-alert');

  if (progressSlider && progressVal) {
    progressSlider.addEventListener('input', () => {
      progressVal.textContent = progressSlider.value + '%';
    });
  }

  if (updateTrackingBtn) {
    updateTrackingBtn.addEventListener('click', () => {
      const truckId = selectTruck.value;
      const newStatus = selectStatus.value;
      const progress = parseInt(progressSlider.value, 10);

      if (activeShipments[truckId]) {
        // Update local memory
        activeShipments[truckId].status = newStatus;
        activeShipments[truckId].progress = progress;

        // Force update map marker positions instantly
        const coords = getCoordinateAtProgress(activeShipments[truckId].route, progress);
        if (truckMarkers[truckId]) {
          truckMarkers[truckId].setLatLng(coords);
          truckMarkers[truckId].setPopupContent(`<strong>Shipment Reference: ${truckId}</strong><br>Status: ${newStatus.toUpperCase()}<br>Route: ${activeShipments[truckId].origin} &rarr; ${activeShipments[truckId].destination}`);
        }

        // Show Admin success message
        trackingAlert.classList.remove('hidden');
        setTimeout(() => {
          trackingAlert.classList.add('hidden');
        }, 3000);

        showToast('Tracking System', `Active shipment ${truckId} updated to ${progress}% (${newStatus}).`, 'refresh-cw');

        // Check if customer query view matches this truck and trigger a refresh dynamically
        if (!trackingResultBox.classList.contains('hidden') && trackerRefId.textContent === truckId) {
          executeTrackQuery();
        }
      }
    });
  }

  /* ==========================================================================
     12. Floating AI Chatbot Widget (Option Tree & Natural Parsing)
     ========================================================================== */
  const chatbotWidget = document.getElementById('chatbot-widget');
  const chatbotToggle = document.getElementById('chatbot-toggle-btn');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-message-input');

  if (chatbotToggle && chatbotWindow) {
    // Toggle Chat window
    chatbotToggle.addEventListener('click', () => {
      const isOpen = !chatbotWindow.classList.contains('hidden');
      if (isOpen) {
        chatbotWindow.classList.add('hidden');
        chatbotToggle.querySelector('.icon-open').classList.remove('hidden');
        chatbotToggle.querySelector('.icon-close').classList.add('hidden');
      } else {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.querySelector('.icon-open').classList.add('hidden');
        chatbotToggle.querySelector('.icon-close').classList.remove('hidden');
        scrollToBottom();
      }
    });

    // Option Button Clicks
    chatBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('chat-opt-btn')) {
        const option = e.target.getAttribute('data-value');
        const text = e.target.textContent;
        
        appendMessage('user', text);
        
        // Remove options elements
        const optionsEl = chatBody.querySelector('.chat-options');
        if (optionsEl) optionsEl.remove();

        setTimeout(() => {
          handleBotResponse(option);
        }, 800);
      }
    });

    // Form text submits
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      appendMessage('user', message);
      chatInput.value = '';

      // Clear standard options block if still present
      const optionsEl = chatBody.querySelector('.chat-options');
      if (optionsEl) optionsEl.remove();

      setTimeout(() => {
        parseAndReplyUserText(message);
      }, 800);
    });
  }

  const appendMessage = (sender, text) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
    msgDiv.innerHTML = `
      <div class="msg-content">
        <p>${text}</p>
      </div>
    `;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const showChatOptions = () => {
    const optDiv = document.createElement('div');
    optDiv.className = 'chat-options';
    optDiv.innerHTML = `
      <button class="chat-opt-btn" data-value="quote">Request Lane Quote</button>
      <button class="chat-opt-btn" data-value="join">Apply to Lease-On</button>
      <button class="chat-opt-btn" data-value="tracking">Track active Cargo</button>
      <button class="chat-opt-btn" data-value="contact">Office Details</button>
    `;
    chatBody.appendChild(optDiv);
    scrollToBottom();
  };

  const handleBotResponse = (option) => {
    let reply = '';
    if (option === 'quote') {
      reply = `To request a shipping quote, please scroll up and fill out our <strong>Shipper Quote Request Form</strong>. Make sure you provide pickup & delivery locations and estimated cargo weight. Let me know if you need help with this.`;
      
      // Auto scroll to quote section for high conversions
      const quoteEl = document.getElementById('quote');
      if (quoteEl) {
        quoteEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (option === 'join') {
      reply = `We're actively recruiting Owner Operators to lease onto Seven Starr Trucking's MC. We offer weekly direct deposits and dedicated dispatcher services. Scroll up and fill out the <strong>Lease-On Application Form</strong> and upload your CDL/Insurance.`;
      
      const recEl = document.getElementById('recruitment');
      if (recEl) {
        recEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (option === 'tracking') {
      reply = `To check cargo status, please look for our <strong>Active Logistics Map</strong> on the page. Enter your STARR cargo reference code (like <strong>STARR-777</strong> or <strong>STARR-999</strong>) into the input box to trace it live.`;
      
      const trackingEl = document.querySelector('.tracking-map-section');
      if (trackingEl) {
        trackingEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (option === 'contact') {
      reply = `Seven Starr Trucking LLC is headquartered in Hialeah, Florida. You can call Sultan Mamun directly at <strong>305-742-7190</strong>. Address: 19900 NW 86th CT, Hialeah, Florida 33015. USDOT #4009071.`;
    }
    
    appendMessage('bot', reply);
    setTimeout(showChatOptions, 1200);
  };

  // Simple keyword matching for typed messages
  const parseAndReplyUserText = (text) => {
    const raw = text.toLowerCase();
    let reply = '';

    if (raw.includes('quote') || raw.includes('price') || raw.includes('rate') || raw.includes('ship')) {
      reply = `To calculate lanes pricing, please fill out the Shipper Quote Request Form located under the Pricing Section on this page. We'll send a rate sheet estimate directly to your email.`;
    } else if (raw.includes('apply') || raw.includes('lease') || raw.includes('job') || raw.includes('hire') || raw.includes('driver')) {
      reply = `We lease owner operators with sleeptabs/cab tractors. We guarantee weekly settlements and high paying lane distributions. Check our Join Our Fleet application form on the page!`;
    } else if (raw.includes('track') || raw.includes('where') || raw.includes('cargo') || raw.includes('starr-')) {
      reply = `Enter your tracking reference number in our Freight Status Inquiry search bar next to the logistics map to trace the container's transit details in real-time.`;
    } else if (raw.includes('phone') || raw.includes('contact') || raw.includes('number') || raw.includes('call') || raw.includes('email')) {
      reply = `You can call our Hialeah logistics office at <strong>305-742-7190</strong>. We are available 24/7.`;
    } else if (raw.includes('dot') || raw.includes('mc') || raw.includes('authority') || raw.includes('number')) {
      reply = `Seven Starr Trucking LLC operates under USDOT Authority Number <strong>4009071</strong> and Interstate MC Number <strong>1689367</strong>.`;
    } else if (raw.includes('owner') || raw.includes('ceo') || raw.includes('founder') || raw.includes('sultan')) {
      reply = `Seven Starr Trucking is founded and led by Sultan Mamun, CEO and Founder.`;
    } else {
      reply = `Thank you for your message! I'm an automated assistant. For complex inquiries, please dial our direct dispatch line at <strong>305-742-7190</strong> to speak with Sultan Mamun or a routing coordinator.`;
    }

    appendMessage('bot', reply);
    setTimeout(showChatOptions, 1200);
  };

  /* ==========================================================================
     13. Toast Notification Alert Manager
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (title, message, iconName = 'info') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Add slide entrance
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="toast-body">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);
    
    // Trigger Lucide icons rendering inside Toast
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Force reflow and show
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 5000);
  };
});
