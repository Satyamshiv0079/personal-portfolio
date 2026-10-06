/**
 * portfolio/script.js
 * Clean, single-pass script — no duplicate listeners, no global pollution.
 */
(function () {
    'use strict';

    /* =========================================================
       PARTICLE CANVAS
       ========================================================= */
    const canvas = document.getElementById('particleCanvas');
    const ctx    = canvas ? canvas.getContext('2d') : null;

    // Reduce particle count on mobile/low-power devices
    const isMobile     = window.matchMedia('(max-width: 768px)').matches;
    const prefersLess  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PARTICLE_COUNT = prefersLess ? 0 : isMobile ? 40 : 80;
    const CONNECT_DIST   = 110;
    const BASE_SPEED     = 0.4;

    let particles   = [];
    let animFrameId = null;
    let mouse       = { x: null, y: null };

    function resize() {
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x:    Math.random() * canvas.width,
            y:    Math.random() * canvas.height,
            vx:   (Math.random() - 0.5) * BASE_SPEED,
            vy:   (Math.random() - 0.5) * BASE_SPEED,
            size: Math.random() * 1.5 + 0.5,
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let a = 0; a < particles.length; a++) {
            const p = particles[a];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Mouse repulsion (gentle)
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                }
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
            ctx.fill();

            // Draw connections — start from a+1 to avoid self-comparison and duplication
            for (let b = a + 1; b < particles.length; b++) {
                const q    = particles[b];
                const ddx  = p.x - q.x;
                const ddy  = p.y - q.y;
                const d    = Math.sqrt(ddx * ddx + ddy * ddy);
                if (d < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - d / CONNECT_DIST) * 0.18})`;
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        drawParticles();
        animFrameId = requestAnimationFrame(animateParticles);
    }

    function stopAnimation() {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    }

    function startAnimation() {
        if (!animFrameId && PARTICLE_COUNT > 0) {
            animateParticles();
        }
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            startAnimation();
        } else {
            stopAnimation();
        }
    });

    if (canvas && PARTICLE_COUNT > 0) {
        resize();
        initParticles();
        startAnimation();
        window.addEventListener('resize', function () {
            resize();
            initParticles();
        });
        canvas.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });
    }

    /* =========================================================
       TYPING EFFECT
       ========================================================= */
    const roles = [
        'Backend Engineer',
        'Full-Stack Developer',
        'GenAI Builder',
        'REST API Developer',
    ];

    const typeEl = document.getElementById('role-text');

    if (typeEl && !prefersLess) {
        let roleIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function type() {
            const current = roles[roleIdx];

            if (!deleting) {
                typeEl.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 1600);
                    return;
                }
            } else {
                typeEl.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx  = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(type, deleting ? 55 : 95);
        }

        type();
    } else if (typeEl) {
        typeEl.textContent = roles[0];
    }

    /* =========================================================
       NAVBAR — scroll + mobile toggle + active link
       ========================================================= */
    const navbar    = document.querySelector('.navbar');
    const menuBtn   = document.getElementById('mobile-menu');
    const navLinks  = document.getElementById('nav-links');
    const allLinks  = document.querySelectorAll('.nav-link');

    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!expanded));
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close on link click (mobile)
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll-spy for active nav link
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let current = '';
        sections.forEach(function (sec) {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        allLinks.forEach(function (link) {
            const href = link.getAttribute('href').slice(1);
            const isActive = href === current;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* =========================================================
       SCROLL REVEAL
       ========================================================= */
    if (!prefersLess) {
        const revealEls = document.querySelectorAll('.scroll-reveal');
        const observer  = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        // Skip reveal animation — show everything immediately
        document.querySelectorAll('.scroll-reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* =========================================================
       PROJECT FILTER
       ========================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projCards  = document.querySelectorAll('.project-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            projCards.forEach(function (card) {
                const cat = card.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;
                card.style.display = show ? '' : 'none';
            });
        });
    });

    /* =========================================================
       CONTACT FORM — mailto (honest, no fake submission)
       ========================================================= */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const nameInput    = document.getElementById('contact-name');
        const emailInput   = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const nameError    = document.getElementById('name-error');
        const emailError   = document.getElementById('email-error');
        const msgError     = document.getElementById('message-error');

        function showError(inputEl, errorEl, msg) {
            if (!inputEl || !errorEl) return;
            inputEl.classList.add('error');
            errorEl.textContent = msg;
        }

        function clearError(inputEl, errorEl) {
            if (!inputEl || !errorEl) return;
            inputEl.classList.remove('error');
            errorEl.textContent = '';
        }

        function validateEmail(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }

        [nameInput, emailInput, messageInput].forEach(function (el) {
            if (!el) return;
            el.addEventListener('input', function () {
                el.classList.remove('error');
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;

            if (nameInput) clearError(nameInput, nameError);
            if (emailInput) clearError(emailInput, emailError);
            if (messageInput) clearError(messageInput, msgError);

            const name    = nameInput    ? nameInput.value.trim()    : '';
            const email   = emailInput   ? emailInput.value.trim()   : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name) {
                showError(nameInput, nameError, 'Please enter your name.');
                valid = false;
            }

            if (!email) {
                showError(emailInput, emailError, 'Please enter your email address.');
                valid = false;
            } else if (!validateEmail(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address.');
                valid = false;
            }

            if (!message) {
                showError(messageInput, msgError, 'Please enter a message.');
                valid = false;
            }

            if (!valid) return;

            // Open mailto — honest, no fake submission
            const subject  = encodeURIComponent('Portfolio Enquiry from ' + name);
            const body     = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
            const mailtoUrl = 'mailto:Satyam.shiv0079@gmail.com?subject=' + subject + '&body=' + body;

            window.location.href = mailtoUrl;
        });
    }

    /* =========================================================
       PORTFOLIO ASSISTANT (rule-based Q&A)
       ========================================================= */
    const toggleBtn  = document.getElementById('chatbot-toggle-btn');
    const closeBtn   = document.getElementById('chatbot-close-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const chatBody   = document.getElementById('chatbot-body');
    const chatInput  = document.getElementById('chatbot-input');
    const sendBtn    = document.getElementById('chatbot-send-btn');

    // Knowledge base — only real facts from the portfolio
    const KB = [
        {
            patterns: ['who are you', 'what is this', 'about you', 'tell me about satyam', 'introduce'],
            answer: "I'm a portfolio assistant. Satyam Shiv is a Backend-focused Software Engineer and B.Tech CSE student at Galgotias University (2023–2026), based in Delhi, India."
        },
        {
            patterns: ['project', 'built', 'made', 'work', 'portfolio'],
            answer: "Satyam has three shipped projects:\n\n• LUXE — E-Commerce with Flask, Groq AI, Supabase, and Socket.IO\n• NovaMind — AI Chatbot with Flask, React, Groq LLM, and Supabase\n• Java Study Tracker — Progress app with Gemini API, React, and Recharts"
        },
        {
            patterns: ['skill', 'technology', 'tech stack', 'language', 'tools', 'know'],
            answer: "Languages: Java, Python, JavaScript, SQL\nBackend: Spring Boot, Flask, REST APIs, Node.js\nDatabases: PostgreSQL, Supabase, MySQL, SQLite\nFrontend: React.js, HTML, CSS\nAI/APIs: Groq API, Gemini API\nTools: Docker, Git, Vercel, Render"
        },
        {
            patterns: ['leetcode', 'dsa', 'algorithm', 'problem solving', 'competitive'],
            answer: "Satyam has solved 150+ problems on LeetCode, practising Arrays, Strings, Trees, Graphs, and Dynamic Programming. Profile: https://leetcode.com/u/Satyamshiv0079/"
        },
        {
            patterns: ['experience', 'intern', 'internship', 'job', 'work history'],
            answer: "Satyam completed two virtual internships in 2024 via EduSkills Academy (AICTE):\n• Google Android Developer — Java, XML, Material Design\n• Microchip Embedded Systems — Embedded C, PIC microcontrollers"
        },
        {
            patterns: ['education', 'degree', 'university', 'college', 'btech', 'graduation'],
            answer: "B.Tech in Computer Science & Engineering, Galgotias University, Greater Noida (2023–2026). Prior: Diploma in Mechanical Engineering, LNCT&S (82.1%)."
        },
        {
            patterns: ['certif', 'certification', 'course', 'credential'],
            answer: "Certifications include:\n• Introduction to Generative AI — Google Cloud\n• Cyber Security Job Simulation — Deloitte Australia\n• Data Analytics Job Simulation — Deloitte Australia\n• CCNA: Introduction to Networks — Cisco\n• 8-Bit Microcontrollers (PIC16) — Microchip Technology"
        },
        {
            patterns: ['contact', 'email', 'reach', 'hire', 'available', 'open to work'],
            answer: "Satyam is open to Software Engineer roles. Email: Satyam.shiv0079@gmail.com\nLinkedIn: linkedin.com/in/satyamshiv0079/\nGitHub: github.com/Satyamshiv0079"
        },
        {
            patterns: ['github', 'repo', 'code', 'source'],
            answer: "GitHub: https://github.com/Satyamshiv0079\nPortfolio repo: https://github.com/Satyamshiv0079/personal-portfolio"
        },
        {
            patterns: ['linkedin'],
            answer: "LinkedIn: https://www.linkedin.com/in/satyamshiv0079/"
        },
        {
            patterns: ['location', 'city', 'where', 'based', 'india', 'delhi'],
            answer: "Satyam is based in Delhi, India."
        },
        {
            patterns: ['luxe', 'ecommerce', 'e-commerce', 'store'],
            answer: "LUXE is an e-commerce app built with Flask, Supabase PostgreSQL, React, and Groq API. Features JWT auth, Supabase RLS, real-time Socket.IO channels, an AI shopping assistant, and PDF invoice generation.\nGitHub: https://github.com/Satyamshiv0079/LUXE-Store\nLive: https://luxe-store-nine.vercel.app/"
        },
        {
            patterns: ['novamind', 'chatbot', 'ai chatbot', 'bot', 'groq'],
            answer: "NovaMind is a full-stack AI chatbot. Flask REST API backend, React frontend, Supabase for session persistence, Groq LLM API (Llama 3.3, Mixtral, Gemma), JWT auth, and Docker deployment.\nGitHub: https://github.com/Satyamshiv0079/ai-chatbot\nLive: https://ai-chatbot-6njs1ys87-satyamshiv0079s-projects.vercel.app"
        },
        {
            patterns: ['java', 'tracker', 'study', 'pomodoro', 'gemini'],
            answer: "The Java Study Tracker is a 45-day curriculum app with progress analytics (Recharts), Gemini API mentor, Pomodoro timer, and topics covering Spring Boot, SQL, DSA, and System Design.\nGitHub: https://github.com/Satyamshiv0079/java-study-tracker\nLive: https://java-study-tracker-omega.vercel.app/"
        },
    ];

    function getBotAnswer(query) {
        const q = query.toLowerCase().trim();
        if (!q) return null;

        for (const entry of KB) {
            for (const pat of entry.patterns) {
                if (q.includes(pat)) {
                    return entry.answer;
                }
            }
        }
        return "I don't have an answer for that. Try asking about Satyam's projects, skills, education, certifications, or how to get in touch. You can also email directly at Satyam.shiv0079@gmail.com.";
    }

    function appendMsg(text, who) {
        if (!chatBody) return;
        const div = document.createElement('div');
        div.className = 'chat-message ' + who;
        div.textContent = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        if (!chatBody) return null;
        const div = document.createElement('div');
        div.className = 'chat-typing';
        div.setAttribute('aria-label', 'Assistant is typing');
        div.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return div;
    }

    function handleSend() {
        if (!chatInput) return;
        const query = chatInput.value.trim();
        if (!query) return;

        appendMsg(query, 'user');
        chatInput.value = '';
        chatInput.focus();

        const typingEl = showTyping();
        setTimeout(function () {
            if (typingEl && typingEl.parentNode) {
                typingEl.parentNode.removeChild(typingEl);
            }
            const answer = getBotAnswer(query);
            appendMsg(answer, 'bot');
        }, 520);
    }

    if (toggleBtn && chatWindow && closeBtn) {
        toggleBtn.addEventListener('click', function () {
            const isOpen = chatWindow.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
            chatWindow.setAttribute('aria-hidden', String(!isOpen));
            if (isOpen && chatInput) chatInput.focus();
        });

        closeBtn.addEventListener('click', function () {
            chatWindow.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            chatWindow.setAttribute('aria-hidden', 'true');
            toggleBtn.focus();
        });

        // Close on Escape
        chatWindow.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                chatWindow.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                chatWindow.setAttribute('aria-hidden', 'true');
                toggleBtn.focus();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });
    }

})(); // end IIFE
