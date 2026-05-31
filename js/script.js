document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon between bars and times
        const icon = menuBtn.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. Sticky Header on Scroll
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    const faders = document.querySelectorAll('.fade-in-up, .slide-in-right, .slide-in-left');
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 4. Menu Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                // Remove animation class to re-trigger it
                item.classList.remove('show-animation');
                
                if(filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    // Add slight delay before adding animation class
                    setTimeout(() => {
                        item.classList.add('show-animation');
                    }, 10);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Trigger 'all' initially to add animation
    const activeBtn = document.querySelector('.filter-btn.active');
    if(activeBtn) {
        activeBtn.click();
    }

    // 5. Shopping Cart Logic
    let cart = [];
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');

    // Open cart
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    });

    // Close cart
    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Add item to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);

            if(existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCartUI();
            
            // Visual feedback
            btn.innerHTML = 'تمت الإضافة <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = 'var(--primary-color)';
            btn.style.color = 'var(--bg-darker)';
            setTimeout(() => {
                btn.innerHTML = 'أضف للطلب';
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--primary-color)';
            }, 1500);
        });
    });

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if(cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">السلة فارغة حالياً</div>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                count += item.quantity;

                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${item.price} ر.س</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        cartTotalPrice.innerText = `${total} ر.س`;
        cartCount.innerText = count;

        // Add event listeners for plus/minus buttons
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if(item) item.quantity += 1;
                updateCartUI();
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const itemIndex = cart.findIndex(i => i.id === id);
                if(itemIndex > -1) {
                    if(cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity -= 1;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                }
                updateCartUI();
            });
        });
    }

});
