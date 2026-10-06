// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- PARTICLE BACKGROUND CANVAS ---
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 100 };

    // Resize Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.baseColor = 'rgba(167, 139, 250, 0.4)'; // Neon violet-ish
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse Interaction (Push/Attract effect)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * 1.5;
                    let directionY = forceDirectionY * force * 1.5;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.baseColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init Particle System
    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Draw lines between nearby particles
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    let opacity = (1 - (distance / 120)) * 0.15;
                    ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`; // Soft blue lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Custom space background logic in canvas if needed, else gradient-css takes care of it
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();


    // --- TYPING EFFECT ---
    const roles = ["Backend Engineer.", "Software Engineer.", "GenAI Integrator.", "Problem Solver."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('role-text');

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 40 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    }
    if (typingSpan) typeEffect();


    // --- MOBILE NAVBAR TOGGLE ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // Scroll Navbar effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- ACTIVE NAV LINK STATE ON SCROLL ---
    const sections = document.querySelectorAll('section');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink);


    // --- PROJECTS CATEGORY FILTER ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // --- CONTACT FORM SUBMISSION MOCK ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulating API submit success
            formSuccess.style.display = 'block';
            contactForm.reset();
            
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        });
    }


    // --- SCROLL REVEAL OBSERVER ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the skills section, animate the bars
                if (entry.target.id === 'skills') {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        // Triggers transition by reading style
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    // --- CHATBOT WIDGET TOGGLE & MESSAGING ---
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');

    if (chatbotToggleBtn && chatbotWindow && chatbotCloseBtn) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.textContent = text;
        chatbotBody.appendChild(messageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function generateBotResponse(userMsg) {
        const query = userMsg.toLowerCase();
        
        if (query.includes('project') || query.includes('work') || query.includes('luxe') || query.includes('novamind') || query.includes('tracker')) {
            return "Satyam has built three key projects:\n1. LUXE: An AI-Powered Luxury E-Commerce platform using Flask, Socket.IO, Groq API, and Supabase.\n2. NovaMind: A Spatial 3D AI Chatbot built with React, Flask, Groq LLMs (Llama 3.3, Mixtral, Gemma), Supabase PostgreSQL, and JWT authentication.\n3. 45-Day Java Study Tracker: A full-stack Spring Boot education roadmap using the Gemini API.";
        }
        if (query.includes('skill') || query.includes('tech') || query.includes('language') || query.includes('frontend') || query.includes('backend') || query.includes('database')) {
            return "Satyam's technical skills include:\n• Languages: Java, Python, JavaScript, SQL\n• Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS\n• Backend: Spring Boot, Flask, Node.js, Express.js\n• Databases: PostgreSQL, Supabase, SQLite, MySQL\n• AI: Gemini API, Groq Llama, TF-IDF\n• Tools: Docker, Git, AWS, Vercel, Render";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('connect') || query.includes('reach')) {
            return "You can reach Satyam via email at Satyam.shiv0079@gmail.com. You can also view his work on GitHub (github.com/Satyamshiv0079) or connect on LinkedIn (linkedin.com/in/satyamshiv0079/).";
        }
        if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('degree')) {
            return "Satyam graduated with a B.Tech in Computer Science and Engineering from Galgotias University (2023-2026). He also holds a Diploma in Mechanical Engineering from LNCT&S (82.1%).";
        }
        if (query.includes('intern') || query.includes('experience') || query.includes('virtual')) {
            return "Satyam completed two virtual internships in 2024 via EduSkills Academy:\n• Google Android Developer Virtual Intern (Java, XML, Material Design)\n• Microchip Embedded Systems Virtual Intern (Embedded C, PIC microcontrollers)";
        }
        if (query.includes('certif') || query.includes('award') || query.includes('achieve') || query.includes('leetcode')) {
            return "Satyam holds certifications in CCNA (Networks), Intro to Generative AI, 8-Bit Microcontrollers, and Deloitte Job Simulations. He has also solved 150+ DSA problems on LeetCode!";
        }
        
        return "I'm NovaMind, Satyam's AI assistant. Ask me anything about his projects, skills, education, internships, or certifications!";
    }

    function handleChatSend() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatbotInput.value = '';

        // Typing indicator / small delay simulation
        setTimeout(() => {
            const botResponse = generateBotResponse(text);
            appendMessage(botResponse, 'bot');
        }, 500);
    }

    if (chatbotSendBtn && chatbotInput) {
        chatbotSendBtn.addEventListener('click', handleChatSend);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSend();
        });
    }

    revealElements.forEach(el => revealObserver.observe(el));
});
