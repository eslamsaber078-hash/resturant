/* Core Script: Eslam Saber Redesign Portfolio */

// ============================================================
//  INTRO / PRELOADER  – runs immediately, before DOMContentLoaded
// ============================================================
(function () {
    // Lock scroll while intro is visible
    document.documentElement.style.overflow = 'hidden';

    // Animate the progress bar from 0 → 100 % over ~2.5 s
    const INTRO_DURATION = 2500; // ms
    const FADE_DURATION  = 800;  // ms (matches CSS transition)
    let startTime = null;

    function animateBar(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed  = timestamp - startTime;
        const progress = Math.min(elapsed / INTRO_DURATION * 100, 100);

        const bar = document.getElementById('introProgressBar');
        if (bar) bar.style.width = progress + '%';

        if (progress < 100) {
            requestAnimationFrame(animateBar);
        } else {
            // Trigger fade-out
            const screen = document.getElementById('introScreen');
            if (screen) {
                screen.classList.add('intro-hidden');
                // Restore scroll and remove node after transition
                setTimeout(() => {
                    document.documentElement.style.overflow = '';
                    if (screen.parentNode) screen.parentNode.removeChild(screen);
                }, FADE_DURATION);
            } else {
                document.documentElement.style.overflow = '';
            }
        }
    }

    // Start as soon as the DOM is parsed (no need to wait for images)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(animateBar));
    } else {
        requestAnimationFrame(animateBar);
    }
})();

// Scroll to very top on every page load/refresh (disable browser's own scroll restoration)
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Wrap entire script in DOMContentLoaded to prevent early selection errors or double typewriter calls.
document.addEventListener('DOMContentLoaded', () => {
    // Ensure top position after DOM ready
    window.scrollTo(0, 0);
    
    // 1. Language and Typewriter data setup
    let currentLanguage = 'ar'; // Default language state
    
    const rolesAR = [
        'مطور تطبيقات C# & WinForms',
        'مطور واجهات الويب Frontend',
        'ممثل خدمة عملاء بالبنك الأهلي المصري',
        'محب للابتكار والتكنولوجيا الحديثة'
    ];

    const rolesEN = [
        'C# & WinForms Desktop Developer',
        'Frontend Web Layout Developer',
        'Customer Relations Specialist at NBE',
        'Tech Innovator & Active Learner'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;
    let typingTimeout = null;

    // Complete bilingual translation dictionary
    const translations = {
        ar: {
            "nav-home": "الرئيسية",
            "nav-services": "الخدمات",
            "nav-skills": "المهارات",
            "nav-about": "من أنا",
            "nav-projects": "المشاريع",
            "nav-contact": "اتصل بي",
            "hero-hello": "مرحباً بك، أنا",
            "hero-name-val": "إسلام صابر",
            "hero-description": "مطور متكامل متخصص في تصميم تطبيقات سطح المكتب الذكية باستخدام لغة C# وإطار عمل Windows Forms، بالإضافة إلى بناء مواقع ويب تفاعلية حديثة واستخدام مهارات خدمة العملاء والعمل البنكي لتقديم حلول متكاملة ذات جودة فائقة.",
            "btn-cv": "تحميل السيرة الذاتية",
            "btn-contact": "تواصل معي",
            "stat-exp": "سنوات خبرة في خدمة العملاء",
            "stat-proj": "تطبيقات سطح مكتب جاهزة",
            "stat-track": "مسارات تقنية متقاطعة",
            "stat-sat": "الالتزام بالعمل والتعلم المستمر",
            "services-title": "خدماتي المتميزة",
            "services-subtitle": "أقدم حلولاً متكاملة تجمع بين القوة التقنية في بناء التطبيقات وبين التميز الإداري في تلبية احتياجات العملاء",
            "serv-csharp-title": "تطبيقات C# & WinForms",
            "serv-csharp-desc": "تصميم وبناء تطبيقات سطح مكتب قوية وآمنة لأنظمة Windows باستخدام لغة C# مع قواعد بيانات محلية، مع واجهات مستخدم سلسة وتفاعلية وسهلة الاستخدام تلبي احتياجات الأعمال المختلفة.",
            "serv-web-title": "تطوير واجهات الويب (Frontend)",
            "serv-web-desc": "تطوير مواقع وتطبيقات ويب سريعة الاستجابة ومتوافقة مع جميع شاشات الهواتف والأجهزة اللوحية، باستخدام أحدث تقنيات HTML5، CSS3، وJavaScript لتوفير تجربة مستخدم مبهرة.",
            "serv-bank-title": "العمل البنكي وخدمة العملاء",
            "serv-bank-desc": "خبرة تمتد لأكثر من 5 سنوات في العمل المصرفي وخدمة العملاء (حالياً بمصرف البنك الأهلي المصري)، تشمل حل مشكلات العملاء المعقدة، والسرعة الفائقة في إدخال البيانات والتواصل الفعال.",
            "skills-title": "مهاراتي وخبراتي",
            "skills-subtitle": "التقنيات البرمجية والأدوات التي أستخدمها في تنفيذ مشاريعي بكفاءة واحترافية عالية",
            "skills-tech-title": "المهارات التقنية والبرمجية",
            "skills-soft-title": "المهارات الشخصية والبنكية",
            "sk-cust": "خدمة العملاء ومهارات التواصل",
            "sk-bank": "العمل البنكي والأنظمة المصرفية",
            "sk-entry": "إدخال البيانات السريع والدقة الإدارية",
            "sk-learn": "سرعة التعلم والتكيف مع الأنظمة الحديثة",
            "about-title": "من أنا ومسيرتي المهنية",
            "about-subtitle": "رحلتي العملية المتميزة التي تدمج بين العمل المصرفي وعالم البرمجيات وتطوير التكنولوجيا",
            "about-bio-who": "من هو إسلام صابر؟",
            "about-bio-text": "أنا شاب طموح ومثابر أبلغ من العمر 25 عاماً، أمتلك شغفاً لا حدود له للتكنولوجيا والتعلم الذاتي. أعمل حالياً كـ ممثل خدمة عملاء في البنك الأهلي المصري منذ أكثر من 5 سنوات، وهو ما أكسبني مهارات استثنائية في التواصل وحل المشكلات وإدارة الأزمات. إلى جانب ذلك، استثمرت طاقتي في احتراف البرمجة، وقمت ببناء العديد من المشاريع المميزة في تطبيقات سطح المكتب وألعاب الكمبيوتر التفاعلية ولدي معرفة راسخة بتطوير الويب الحديث.",
            "fact-age": "العمر:",
            "fact-edu": "الشغف:",
            "fact-loc": "الموقع:",
            "fact-job": "العمل الحالي:",
            "timeline-header": "الجدول الزمني للخبرات",
            "tl-nbe-title": "ممثل خدمة عملاء بالبنك الأهلي المصري",
            "tl-nbe-desc": "تقديم الدعم والمساعدة المصرفية لعملاء البنك، والتعامل المباشر مع الأنظمة المعقدة وإدارة الحسابات البنكية وحل المشاكل التقنية والمالية بدقة وسرعة فائقة.",
            "tl-csharp-title": "احتراف تطوير C# & Desktop Applications",
            "tl-csharp-desc": "تصميم وتنفيذ 8 تطبيقات سطح مكتب متكاملة تشمل برمجيات حماية كلمات المرور، ومحاكاة ماكينات الـ ATM، وتطوير ألعاب أركيد تفاعلية كلاسيكية مثل Pac-Man و Dinos وغيرها.",
            "tl-web-title": "التوسع في تطوير الويب والواجهات الأمامية",
            "tl-web-desc": "تعلم وبناء مواقع وتطبيقات ويب سريعة وحديثة، ودمج التقنيات التفاعلية وبناء الهياكل الأنيقة لتقديم تجربة بصرية فائقة وخدمات مميزة.",
            "projects-title": "مشاريعي الإبداعية",
            "projects-subtitle": "مجموعة مختارة من مشاريعي في تصميم الويب، تطبيقات Windows Forms، وتطبيقات Flutter — اضغط على التبويب لتصفية المشاريع",
            "p1-title": "برنامج إدارة كلمات المرور",
            "p1-desc": "تطبيق متكامل وآمن للغاية لحفظ وإدارة كلمات المرور الخاصة بحساباتك المختلفة بطريقة مشفرة وسهلة الاسترجاع.",
            "p-run-pc": "يتطلب كمبيوتر للتشغيل. كلمة السر الافتراضية: 1234 (لا يتطلب اسم مستخدم).",
            "btn-video": "فيديو توضيحي",
            "btn-download": "تحميل للكمبيوتر",
            "p2-title": "نظام محاكاة ماكينة ATM",
            "p2-desc": "تطبيق ذكي يحاكي بدقة وظائف ماكينة الصراف الآلي الحقيقية من حيث السحب والإيداع والاستعلام عن الرصيد وتغيير كلمة السر.",
            "p-pass-1234": "يتطلب كمبيوتر للتشغيل. كلمة السر هي: 1234",
            "p3-title": "لعبة الطائر الفلابي",
            "p3-desc": "لعبة الطيران الكلاسيكية مصممة ومبرمجة بالكامل في إطار عمل WinForms مع نظام حساب وحفظ النقاط والجاذبية الأرضية.",
            "p-run-generic": "يجب تشغيل الملف على نظام ويندوز للكمبيوتر.",
            "p4-title": "محاكي ألعاب الرهان والأركيد",
            "p4-desc": "تطبيق تفاعلي يحتوي على لعبتين شيقتين تم بناؤهما وتطويرهما بشكل مشابه للعبة الشهيرة 1xbet.",
            "p5-title": "لعبة باك مان الكلاسيكية",
            "p5-desc": "إعادة إنشاء تفصيلية للعبة الأركيد الشهيرة Pac-Man مع تصميم المتاهة، الأشباح والذكاء الاصطناعي البسيط لحركة العناصر.",
            "p6-title": "لعبة الديناصور T-Rex Offline",
            "p6-desc": "محاكاة تفاعلية للعبة الديناصور الشهيرة في متصفح Chrome أثناء انقطاع الإنترنت، تمت إعادة برمجتها بالكامل للكمبيوتر.",
            "p7-title": "لعبة إكس-أو الذكية (Tic Tac Toe)",
            "p7-desc": "لعبة إكس أو ثنائية اللاعبين ممتعة وتضم لوحة متقدمة لعرض النتائج المتراكمة وحفظ حالة الفائزين وتصميم عصري جذاب.",
            "p8-title": "لعبة بينج بونج الكلاسيكية",
            "p8-desc": "لعبة تنس الطاولة الكلاسيكية ثنائية اللاعبين تضم حركة فيزيائية وتصادمات سريعة وتأثيرات صوتية وحركية حية.",
            "contact-title": "تواصل معي فوراً",
            "contact-subtitle": "يسعدني دائماً تواصلك لمناقشة أفكار المشاريع، فرص العمل المتاحة، أو أي استفسارات مصرفية وتقنية",
            "cont-phone": "رقم الهاتف",
            "cont-email": "البريد الإلكتروني",
            "cont-whatsapp": "تواصل عبر واتساب",
            "form-header": "أرسل لي رسالة",
            "form-label-name": "الاسم بالكامل",
            "form-label-email": "البريد الإلكتروني",
            "form-label-msg": "مضمون الرسالة",
            "form-btn": "إرسال الرسالة",
            "filter-all": "الكل",
            "filter-web": "تصميمات الويب",
            "filter-winforms": "Windows Forms",
            "filter-flutter": "Flutter",
            "p9-title": "موقع البورتفوليو الشخصي",
            "p9-desc": "تصميم وبرمجة موقع بورتفوليو شخصي احترافي يعرض المشاريع والمهارات بتصميم عصري ثنائي اللغة مع وضع ليلي ونهاري.",
            "p10-title": "تطبيق موبايل بـ Flutter",
            "p10-desc": "تطبيق جوال متكامل تم بناؤه بإطار عمل Flutter مع تصميم عصري وواجهة مستخدم سلسة تعمل على Android و iOS.",
            "p-web-live": "موقع ويب يعمل على جميع المتصفحات والأجهزة.",
            "p-flutter-info": "يعمل على Android و iOS بكود موحد.",
            "btn-preview": "معاينة مباشرة",
        },
        en: {
            "nav-home": "Home",
            "nav-services": "Services",
            "nav-skills": "Skills",
            "nav-about": "About",
            "nav-projects": "Projects",
            "nav-contact": "Contact",
            "hero-hello": "Welcome, I am",
            "hero-name-val": "Eslam Saber",
            "hero-description": "A cross-disciplinary developer specialized in creating high-performance desktop software utilizing C# and Windows Forms, along with beautiful responsive frontend web layouts and over 5 years of commercial banking expertise.",
            "btn-cv": "Download Resume",
            "btn-contact": "Get In Touch",
            "stat-exp": "Years of NBE Customer Service",
            "stat-proj": "Native C# Windows Projects",
            "stat-track": "Cross-Disciplinary Domains",
            "stat-sat": "Learning Adaptability & Focus",
            "services-title": "Professional Services",
            "services-subtitle": "Holistic solutions fusing high-fidelity desktop code development with operational customer relationship excellence",
            "serv-csharp-title": "C# & WinForms Software",
            "serv-csharp-desc": "Designing high-performance, secure Windows apps using C# with local data layers, streamlined custom dashboard controls, and clean UX designs.",
            "serv-web-title": "Frontend Development Templates",
            "serv-web-desc": "Building fluid, responsive and accessible web layouts using advanced HTML5, CSS3 Variables, and vanilla JavaScript for clean display portfolios.",
            "serv-bank-title": "Banking & Customer Relations",
            "serv-bank-desc": "Over 5 years of retail banking client management (currently at National Bank of Egypt), handling credit operations, speed-critical entries, and administrative logistics.",
            "skills-title": "Technical Expertise",
            "skills-subtitle": "A synthesis of programming languages, development stacks, and operational banking assets",
            "skills-tech-title": "Software Development & Tech",
            "skills-soft-title": "Client Relations & Banking",
            "sk-cust": "Customer Support & Active Communication",
            "sk-bank": "Banking Systems & Credit Operations",
            "sk-entry": "Fast Alphanumeric Entry & File Precision",
            "sk-learn": "Dynamic Learning & Adaptive Problem Solving",
            "about-title": "My Professional Journey",
            "about-subtitle": "Tracing my dual progression in banking customer services and active software engineering",
            "about-bio-who": "Who is Eslam Saber?",
            "about-bio-text": "I am an ambitious, self-driven 25-year-old developer with over 5 years of customer service experience inside the National Bank of Egypt (NBE). Working in one of Egypt's major banking environments has gifted me with extreme problem-solving, communications, and logistical skills. Alongside my financial career, I have dedicated myself to programming, successfully crafting and shipping 8 native desktop applications, retro arcade games, and modern responsive web layouts.",
            "fact-age": "Age:",
            "fact-edu": "Passion:",
            "fact-loc": "Based in:",
            "fact-job": "Current Position:",
            "timeline-header": "Professional Career Roadmap",
            "tl-nbe-title": "Customer Relations Representative at NBE",
            "tl-nbe-desc": "Assisting commercial bank clients, operating secure transaction portals, resolving high-priority requests, and managing banking records with extreme speed.",
            "tl-csharp-title": "Native C# & Desktop Applications Focus",
            "tl-csharp-desc": "Designing, building, and distributing 8 native desktop projects including local password managers, transactional ATM simulations, and arcade game clones.",
            "tl-web-title": "Frontend Layout Integrations",
            "tl-web-desc": "Mastering CSS Grid/Flexbox, dynamic animations, and JavaScript to engineer modern, highly interactive bicultural web layouts.",
            "projects-title": "Creative Portfolio Showreel",
            "projects-subtitle": "A curated collection of my Web Design, Windows Forms, and Flutter projects — click a tab to filter by category",
            "p1-title": "Secure Password Locker App",
            "p1-desc": "A fully offline, encrypted credential manager application to store, search, and manage secure accounts locally.",
            "p-run-pc": "Requires Windows OS. Default password to enter: 1234 (No username required).",
            "btn-video": "Watch Video",
            "btn-download": "Download on PC",
            "p2-title": "ATM Transaction Simulator",
            "p2-desc": "An interactive C# application emulating complete automated teller operations, deposits, withdraws, and pin resets.",
            "p-pass-1234": "Requires Windows PC. Default PIN is: 1234",
            "p3-title": "Flappy Bird Retro Arcade",
            "p3-desc": "A remake of the famous Flappy Bird tapping arcade game built from scratch inside WinForms using gravity vectors.",
            "p-run-generic": "The executable binary requires Windows OS on a PC.",
            "p4-title": "1xBet Minigames Simulation",
            "p4-desc": "A desktop game pack containing two interactive prediction minigames designed similarly to 1xBet layout flows.",
            "p5-title": "Classic Pac-Man Arcade Clone",
            "p5-desc": "Recreating the nostalgic Pac-Man maze game inside C# with custom player keyboards and basic AI ghost behaviors.",
            "p6-title": "Offline Dino T-Rex Simulator",
            "p6-desc": "The offline dinosaur jumping game recreated natively in C# WinForms to play directly on Windows desktop.",
            "p7-title": "Tic-Tac-Toe (XO) Arena",
            "p7-desc": "A beautiful Tic-Tac-Toe board featuring advanced match score keeping and smooth dual player modes.",
            "p8-title": "Classic Ping Pong Arcade",
            "p8-desc": "Retro keyboard controlled double-paddle table tennis game with custom bounce math and scoreboard logs.",
            "contact-title": "Get In Touch Instantly",
            "contact-subtitle": "I am always excited to discuss new software ventures, client relationship operations, or bank processes",
            "cont-phone": "Direct Phone",
            "cont-email": "Email Address",
            "cont-whatsapp": "WhatsApp Chat",
            "form-header": "Send Me a Message",
            "form-label-name": "Full Name",
            "form-label-email": "Email Address",
            "form-label-msg": "Your Message",
            "form-btn": "Send Message",
            "filter-all": "All",
            "filter-web": "Web Designs",
            "filter-winforms": "Windows Forms",
            "filter-flutter": "Flutter",
            "p9-title": "Personal Portfolio Website",
            "p9-desc": "Design and development of a professional personal portfolio site with dual-language support, dark/light mode and modern UI.",
            "p10-title": "Mobile App with Flutter",
            "p10-desc": "A full-featured mobile application built with Flutter framework, featuring modern design and smooth UI running on Android & iOS.",
            "p-web-live": "A web application that works across all browsers and devices.",
            "p-flutter-info": "Works on both Android and iOS with a single codebase.",
            "btn-preview": "Live Preview",
        }
    };

    // 2. Select HTML nodes safely
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const langToggleBtn = document.getElementById('langToggleBtn');
    const currentYearSpan = document.getElementById('currentYear');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const header = document.querySelector('.navbar-header');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoIframeContainer = document.getElementById('videoIframeContainer');
    const contactForm = document.getElementById('contactForm');
    const formToast = document.getElementById('formToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    const scrollDownIndicator = document.getElementById('scrollDownIndicator');

    // 3. Set Dynamic Copyright Year in Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 4. Hamburger mobile navigation interactions
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }
        });

        // Auto close menu upon link clicking
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // 5. Scroll triggers and sticky navigation effects
    let isScrollScheduled = false;
    function handleScroll() {
        // Apply solid layout when scrolled
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Float standard scroll-to-top button
        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
            }
        }

        // Hide scroll down indicator when scrolling
        if (scrollDownIndicator) {
            if (window.scrollY > 80) {
                scrollDownIndicator.classList.add('hidden');
            } else {
                scrollDownIndicator.classList.remove('hidden');
            }
        }
        
        // Active node mapping
        detectActiveSection();
        
        isScrollScheduled = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrollScheduled) {
            isScrollScheduled = true;
            window.requestAnimationFrame(handleScroll);
        }
    }, { passive: true });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    function detectActiveSection() {
        if (sections.length === 0 || navItems.length === 0) return;
        
        let currentActiveId = 'home';
        sections.forEach(sec => {
            const top = window.scrollY;
            const offset = sec.offsetTop - 180;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            
            if (top >= offset && top < offset + height) {
                currentActiveId = id;
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentActiveId}`) {
                item.classList.add('active');
            }
        });
    }

    // 6. Safe Scroll Observer Reveal Elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate skill progress bars upon reaching section
                if (entry.target.id === 'skills') {
                    document.querySelectorAll('.skill-progress-bar-fill').forEach((fill, idx) => {
                        const widthVal = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = widthVal;
                        }, 120 + idx * 80);
                    });
                }
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-item, #skills').forEach(item => {
        revealObserver.observe(item);
    });

    // Also observe service cards individually for staggered animation
    document.querySelectorAll('.service-card').forEach(card => {
        revealObserver.observe(card);
    });

    // Observe about intro box for split animation
    const aboutIntroBox = document.querySelector('.about-intro-box');
    if (aboutIntroBox) {
        revealObserver.observe(aboutIntroBox);
    }

    // 7. Light and Dark Theme Controls
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme');
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // 8. Dynamic YouTube iframe modal functions (safe window overrides)
    function openVideoPlayer(youtubeId, projectTitle) {
        if (!videoPlayerModal || !videoIframeContainer || !videoModalTitle) return;
        
        // Define title dynamically
        videoModalTitle.textContent = currentLanguage === 'ar' ? `استعراض فيديو: ${projectTitle}` : `Video Walkthrough: ${projectTitle}`;
        
        // Embed frame
        videoIframeContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        
        // Lock document scroll and trigger transition class
        videoPlayerModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoPlayer() {
        if (!videoPlayerModal || !videoIframeContainer) return;
        
        // Flush frame and release page scrolling
        videoPlayerModal.classList.remove('open');
        document.body.style.overflow = '';
        videoIframeContainer.innerHTML = '';
    }

    // Bind local handlers securely to Global window contexts
    window.openVideoPlayer = openVideoPlayer;
    window.closeVideoPlayer = closeVideoPlayer;

    // 9. Typewriter Text Engine
    function typeEffect() {
        const typingElement = document.getElementById('typingElement');
        if (!typingElement) return; // Exit if node is missing
        
        const roles = currentLanguage === 'ar' ? rolesAR : rolesEN;
        const currentRole = roles[roleIndex] || '';
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 45;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2200; // Standstill at peak
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Wait before typing next word
        }
        
        typingTimeout = setTimeout(typeEffect, typeSpeed);
    }

    function resetTyping() {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        charIndex = 0;
        isDeleting = false;
        typeEffect();
    }

    // 10. Clean Bilingual Transformer Logic
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Toggle global direct attributes
        document.documentElement.setAttribute('lang', lang);
        
        const bodyEl = document.body;
        if (lang === 'en') {
            document.documentElement.setAttribute('dir', 'ltr');
            if (bodyEl) bodyEl.setAttribute('dir', 'ltr');
            if (langToggleBtn) {
                const textNode = langToggleBtn.querySelector('.lang-text');
                if (textNode) textNode.textContent = 'AR';
            }
        } else {
            document.documentElement.setAttribute('dir', 'rtl');
            if (bodyEl) bodyEl.setAttribute('dir', 'rtl');
            if (langToggleBtn) {
                const textNode = langToggleBtn.querySelector('.lang-text');
                if (textNode) textNode.textContent = 'EN';
            }
        }
        
        // Search and translate all registered keys
        const elementsToTranslate = document.querySelectorAll('[data-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        // Translate interactive placeholders safely
        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const msgInput = document.getElementById('formMessage');
        
        if (nameInput) nameInput.placeholder = lang === 'en' ? "Enter your full name..." : "أدخل اسمك الكريم هنا...";
        if (emailInput) emailInput.placeholder = lang === 'en' ? "name@example.com" : "name@example.com";
        if (msgInput) msgInput.placeholder = lang === 'en' ? "Write your message details here..." : "اكتب تفاصيل طلبك أو رسالتك هنا...";
        
        // Cycle typing engine biculturally
        resetTyping();
        
        // Refresh viewport sections alignment
        detectActiveSection();

        // Update filter count badge language
        const activeTabAfterLang = document.querySelector('.filter-tab.active');
        if (activeTabAfterLang) {
            const currentFilter = activeTabAfterLang.getAttribute('data-filter');
            const cards = document.querySelectorAll('.project-card[data-category]');
            const visible = Array.from(cards).filter(c => {
                return currentFilter === 'all' || c.getAttribute('data-category') === currentFilter;
            }).length;
            const badge = document.getElementById('filterCountBadge');
            if (badge) {
                badge.textContent = lang === 'en'
                    ? `${visible} Project${visible !== 1 ? 's' : ''}`
                    : `${visible} مشروع`;
            }
        }
    }

    // Translate instantly if language button clicked
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = currentLanguage === 'ar' ? 'en' : 'ar';
            setLanguage(nextLang);
        });
    }

    // 11. Contact Form — EmailJS Real Email Delivery
    // EmailJS config: Public Key + Service + Template IDs from emailjs.com dashboard
    const EMAILJS_PUBLIC_KEY = '2XTZ95RJBBkUjJyIH';   // ← replace after creating account
    const EMAILJS_SERVICE_ID = 'service_0ebul4g';   // ← replace with your service ID
    const EMAILJS_TEMPLATE_ID = 'template_dlnnng9';  // ← replace with your template ID
    
    // Initialize EmailJS dynamically only if NOT running under file:// protocol
    // This prevents browser security errors regarding iframe loads in file origins
    if (window.location.protocol !== 'file:') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = () => {
            if (typeof emailjs !== 'undefined') {
                emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            }
        };
        document.head.appendChild(script);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameEl   = document.getElementById('formName');
            const emailEl  = document.getElementById('formEmail');
            const msgEl    = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitFormBtn');



            if (!nameEl || !emailEl || !msgEl) return;

            const nameVal  = nameEl.value.trim();
            const emailVal = emailEl.value.trim();
            const msgVal   = msgEl.value.trim();

            if (!nameVal || !emailVal || !msgVal) return;

            // Show loading state on button
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>${currentLanguage === 'en' ? 'Sending...' : 'جارٍ الإرسال...'}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            submitBtn.disabled = true;

            // Build the template params for EmailJS
            const templateParams = {
                from_name:    nameVal,
                from_email:   emailVal,
                message:      msgVal,
                to_email:     'eslamsaber078@gmail.com',
                reply_to:     emailVal,
            };

            try {
                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    // Real send via EmailJS
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                } else {
                    // Fallback: open default mail client with prefilled content
                    const subject = encodeURIComponent(`رسالة من ${nameVal} عبر موقع البورتفوليو`);
                    const body    = encodeURIComponent(`الاسم: ${nameVal}\nالإيميل: ${emailVal}\n\nالرسالة:\n${msgVal}`);
                    window.location.href = `mailto:eslamsaber078@gmail.com?subject=${subject}&body=${body}`;
                }

                showSuccessToast('success');
                contactForm.reset();
            } catch (err) {
                console.error('EmailJS error:', err);
                showSuccessToast('error');
            } finally {
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            }
        });
    }

    function showSuccessToast(status = 'success') {
        if (!formToast || !toastTitle || !toastBody) return;

        const toastIcon = formToast.querySelector('.toast-icon i');

        if (status === 'success') {
            if (toastIcon) toastIcon.className = 'fa-solid fa-circle-check';
            formToast.style.borderColor = 'var(--accent-cyan)';
            if (currentLanguage === 'en') {
                toastTitle.textContent = "Sent Successfully!";
                toastBody.textContent  = "Thank you for getting in touch. I will respond to you shortly.";
            } else {
                toastTitle.textContent = "تم الإرسال بنجاح!";
                toastBody.textContent  = "شكراً لتواصلك، سأقوم بالرد عليك في أقرب وقت ممكن.";
            }
        } else {
            if (toastIcon) toastIcon.className = 'fa-solid fa-circle-exclamation';
            formToast.style.borderColor = '#ef4444';
            if (currentLanguage === 'en') {
                toastTitle.textContent = "Sending Failed";
                toastBody.textContent  = "Your email app will open instead to send the message.";
            } else {
                toastTitle.textContent = "فشل الإرسال";
                toastBody.textContent  = "سيتم فتح تطبيق البريد لإرسال الرسالة بدلاً من ذلك.";
            }
        }

        formToast.classList.add('show');
        setTimeout(() => {
            formToast.classList.remove('show');
            formToast.style.borderColor = '';
        }, 5000);
    }

    // 12. Run Safe Initialize Routines on load
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);

    // 13. Project Filter Tabs System
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    const filterCountBadge = document.getElementById('filterCountBadge');

    function updateFilterCount(visibleCount, lang) {
        if (!filterCountBadge) return;
        filterCountBadge.textContent = lang === 'en'
            ? `${visibleCount} Project${visibleCount !== 1 ? 's' : ''}`
            : `${visibleCount} مشروع`;
    }

    function applyFilter(filterValue) {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || category === filterValue;

            if (shouldShow) {
                card.classList.remove('filter-hidden');
                visibleCount++;
            } else {
                card.classList.add('filter-hidden');
            }
        });

        updateFilterCount(visibleCount, currentLanguage);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filterValue = tab.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    // Initialize with all visible
    applyFilter('all');

    // 14. Scroll Down Indicator — hide after user scrolls past hero
    if (scrollDownIndicator) {
        // Clicking it scrolls down past hero
        scrollDownIndicator.addEventListener('click', () => {
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
            }
        });
    }

    // 15. Global Image Fallback & Live Site Sync
    function handleImageError(img) {
        const src = img.getAttribute('src');
        
        // Scenario A: The src is an online live backup URL and failed (e.g. offline)
        if (src && src.startsWith('https://eslamsaber078-hash.github.io/EslamBK/') && !img.dataset.triedLocal) {
            img.dataset.triedLocal = 'true';
            const filename = src.replace('https://eslamsaber078-hash.github.io/EslamBK/', '');
            img.src = decodeURIComponent(filename); // try local path
            return;
        }
        
        // Scenario B: The src is a local relative path and failed
        if (src && !src.startsWith('http') && !img.dataset.triedBackup) {
            img.dataset.triedBackup = 'true';
            img.src = 'https://eslamsaber078-hash.github.io/EslamBK/' + encodeURI(src);
            return;
        }
        
        // Scenario C: Everything failed, load placeholder
        if (!img.dataset.triedPlaceholder) {
            img.dataset.triedPlaceholder = 'true';
            if (img.classList.contains('profile-img') || img.classList.contains('about-photo')) {
                img.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=eslam&backgroundColor=0e172a,1e293b,3b82f6';
            } else {
                img.src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80';
            }
        }
    }

    // Capture image load failures
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            handleImageError(e.target);
        }
    }, true);

    // Check images that failed before script loaded
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
            handleImageError(img);
        }
    });

    // 16. Prevent logo link from navigating or reloading
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 17. Dynamic Toast Helper for general notifications
    function showToastNotification(type) {
        if (!formToast || !toastTitle || !toastBody) return;
        
        if (type === 'video') {
            if (currentLanguage === 'en') {
                toastTitle.textContent = "Demo Video";
                toastBody.textContent = "Video walkthrough is not available for this project yet.";
            } else {
                toastTitle.textContent = "فيديو توضيحي";
                toastBody.textContent = "الفيديو التوضيحي غير متوفر لهذا المشروع حالياً.";
            }
        } else if (type === 'preview') {
            if (currentLanguage === 'en') {
                toastTitle.textContent = "Demo Preview";
                toastBody.textContent = "Live demo is not available for this project yet.";
            } else {
                toastTitle.textContent = "معاينة مباشرة";
                toastBody.textContent = "المعاينة المباشرة غير متوفرة لهذا المشروع حالياً.";
            }
        }
        
        const toastIcon = formToast.querySelector('.toast-icon i');
        if (toastIcon) {
            toastIcon.className = 'fa-solid fa-circle-info';
        }
        
        formToast.classList.add('show');
        setTimeout(() => {
            formToast.classList.remove('show');
            if (toastIcon) {
                toastIcon.className = 'fa-solid fa-circle-check';
            }
        }, 4500);
    }
    window.showToastNotification = showToastNotification;

    // 18. Prevent default anchor hash navigation under file:// protocol
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 19. Interactive Hero Mouse Glow Parallax
    const heroSection = document.getElementById('home');
    const glow1 = document.querySelector('.glow-circle-1');
    const glow2 = document.querySelector('.glow-circle-2');

    if (heroSection && glow1 && glow2) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            glow1.style.transform = `translate(${xPercent * 0.15}px, ${yPercent * 0.15}px)`;
            glow2.style.transform = `translate(${-xPercent * 0.12}px, ${-yPercent * 0.12}px)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            glow1.style.transform = '';
            glow2.style.transform = '';
        });
    }

    // 20. Floating Particles Background in Hero Section (inserted at start to be behind profile photo)
    if (heroSection) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = 'position: absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; pointer-events:none; z-index:0;';
        heroSection.insertBefore(particlesContainer, heroSection.firstChild);
        
        const colors = ['#00f2fe', '#4facfe', '#3b82f6'];
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 3; // 3px to 9px
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                bottom: -20px;
                left: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.15};
                box-shadow: 0 0 8px ${color};
                animation: floatUp ${Math.random() * 8 + 6}s linear infinite;
                animation-delay: ${Math.random() * 4}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }
});

