document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-nav-toggle');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.logo').after(mobileToggle);
    
    mobileToggle.addEventListener('click', function() {
        const mainNav = document.querySelector('.main-nav');
        mainNav.classList.toggle('show');
        this.innerHTML = mainNav.classList.contains('show') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Date picker functionality (simulated)
    const dateInput = document.querySelector('.form-group:nth-child(2) input');
    if (dateInput) {
        dateInput.addEventListener('click', function() {
            alert('Calendar picker would open here');
        });
    }
    
    // Guest selector functionality (simulated)
    const guestInput = document.querySelector('.form-group:nth-child(3) input');
    if (guestInput) {
        guestInput.addEventListener('click', function() {
            alert('Guest selection dropdown would open here');
        });
    }
    
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const destination = document.querySelector('.form-group:nth-child(1) input').value;
            if (!destination) {
                alert('Please enter a destination');
                return;
            }
            alert(`Searching for accommodations in ${destination}`);
            // In a real application, this would redirect to search results page
        });
    }
    
    // Sticky header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Destination cards hover effect
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            alert(`Thank you for subscribing with ${email}! You'll receive our best deals soon.`);
            this.querySelector('input').value = '';
        });
    }
    
    // Local Pulse Vibe Filters
    const vibeFilters = document.querySelectorAll('.vibe-filter');
    if (vibeFilters.length > 0) {
        vibeFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                vibeFilters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                // Filter logic would go here in a real application
                const selectedVibe = this.textContent.toLowerCase();
                
                // For demonstration, show a message
                if (selectedVibe !== 'all') {
                    console.log(`Filtering for ${selectedVibe} vibe`);
                    // In a real app, would filter the pulse cards based on the selected vibe
                }
            });
        });
    }
    
    // Trending Music Play functionality
    const playButtons = document.querySelectorAll('.trending-play');
    if (playButtons.length > 0) {
        playButtons.forEach(button => {
            button.addEventListener('click', function() {
                const songTitle = this.parentElement.querySelector('.trending-title').textContent;
                const artistName = this.parentElement.querySelector('.trending-artist').textContent;
                alert(`Now playing: ${songTitle} by ${artistName}`);
                // In a real app, this would play the music or link to a music service
            });
        });
    }
    
    // Subscribe to Pulse Alerts form
    const pulseSubscribeForm = document.querySelector('.subscribe-form');
    if (pulseSubscribeForm) {
        pulseSubscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            const vibePreference = this.querySelector('select').value;
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (vibePreference === 'Choose your preferred vibe') {
                alert('Please select a vibe preference');
                return;
            }
            
            alert(`Thank you for subscribing to Pulse Alerts for ${vibePreference} vibes! We'll notify you at ${email} when cities match your preference.`);
            this.querySelector('input').value = '';
            this.querySelector('select').selectedIndex = 0;
        });
        
        // Add submit event listener to button inside form
        const subscribeButton = pulseSubscribeForm.querySelector('button');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', function(e) {
                e.preventDefault();
                pulseSubscribeForm.dispatchEvent(new Event('submit'));
            });
        }
    }
    
    // Helper function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Simulate Local Pulse data loading
    simulateLocalPulseData();
    
    // Simulate loading data
    simulateLoadingProperties();
});

// Function to simulate loading Local Pulse data
function simulateLocalPulseData() {
    // In a real application, this would be API calls to various services:
    // - Weather API (OpenWeatherMap, AccuWeather)
    // - Events API (Eventbrite, Ticketmaster)
    // - Social Media Sentiment Analysis (Twitter API + NLP)
    // - Crowd Data (Google Places, Foursquare)
    // - News API (Bing News, NewsAPI.org)
    // - Music API (Spotify, YouTube)
    // - AI-generated tips (GPT API)
    
    // For this demo, we'll just simulate the loading state
    const pulseCards = document.querySelectorAll('.pulse-card');
    if (!pulseCards.length) return;
    
    // Add loading indicators
    pulseCards.forEach(card => {
        const content = card.querySelector('.pulse-card-content');
        if (content) {
            const originalContent = content.innerHTML;
            content.innerHTML = '<div class="loading">Loading pulse data...</div>';
            content.dataset.originalContent = originalContent;
        }
    });
    
    // Simulate network delay and restore content
    setTimeout(() => {
        pulseCards.forEach(card => {
            const content = card.querySelector('.pulse-card-content');
            if (content && content.dataset.originalContent) {
                content.innerHTML = content.dataset.originalContent;
                delete content.dataset.originalContent;
            }
        });
        
        // After loading, activate the dynamic updates for certain widgets
        activateDynamicPulseUpdates();
    }, 1500);
}

// Function to activate dynamic updates for pulse widgets
function activateDynamicPulseUpdates() {
    // In a real app, these would update with real-time data
    // For this demo, we'll just update some values randomly on a timer
    
    // 1. Update crowd density levels periodically
    setInterval(() => {
        const densityLevels = document.querySelectorAll('.density-level');
        densityLevels.forEach(level => {
            const randomWidth = 30 + Math.floor(Math.random() * 70); // Random between 30-100%
            level.style.width = `${randomWidth}%`;
        });
        
        // Update crowd area levels
        const crowdLevels = document.querySelectorAll('.crowd-level');
        crowdLevels.forEach(level => {
            const random = Math.random();
            level.classList.remove('low', 'medium', 'high');
            
            if (random < 0.33) {
                level.classList.add('low');
                level.textContent = 'Low';
            } else if (random < 0.66) {
                level.classList.add('medium');
                level.textContent = 'Moderate';
            } else {
                level.classList.add('high');
                level.textContent = 'High';
            }
        });
    }, 30000); // Update every 30 seconds
    
    // 2. Update sentiment score occasionally
    setInterval(() => {
        const sentimentScores = document.querySelectorAll('.sentiment-score');
        sentimentScores.forEach(score => {
            const emojis = ['🟢', '🟡', '🔴'];
            const labels = ['Positive', 'Neutral', 'Negative'];
            const labelClasses = ['positive', 'neutral', 'negative'];
            
            // Bias toward positive (70% chance of positive)
            const random = Math.random();
            let index = 0; // Default to positive
            
            if (random > 0.7 && random < 0.9) {
                index = 1; // Neutral
            } else if (random >= 0.9) {
                index = 2; // Negative
            }
            
            const emojiSpan = score.querySelector('span:first-child');
            const labelSpan = score.querySelector('.sentiment-label');
            
            if (emojiSpan && labelSpan) {
                emojiSpan.textContent = emojis[index];
                labelSpan.textContent = `${labels[index]} (${85 + Math.floor(Math.random() * 10)}/100)`;
                
                labelSpan.classList.remove('positive', 'neutral', 'negative');
                labelSpan.classList.add(labelClasses[index]);
            }
        });
    }, 60000); // Update every minute
}

// Function to simulate loading featured properties
function simulateLoadingProperties() {
    // This would typically be an API call to get featured properties
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return;
    
    // Add a loading indicator
    featuredGrid.innerHTML = '<div class="loading">Loading featured properties...</div>';
    
    // Simulate network delay
    setTimeout(() => {
        // Remove loading indicator and restore original content
        const loadingIndicator = document.querySelector('.loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }, 1000);
}

// Add sticky header styles dynamically
const style = document.createElement('style');
style.textContent = `
    .header.sticky {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
    
    .mobile-nav-toggle {
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
    
    @media (max-width: 768px) {
        .mobile-nav-toggle {
            display: block;
            position: absolute;
            right: 20px;
            top: 15px;
        }
        
        .main-nav {
            display: none;
        }
        
        .main-nav.show {
            display: block;
        }
        
        .main-nav ul {
            flex-direction: column;
        }
        
        .main-nav li {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
    
    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
    }
`;
document.head.appendChild(style); 