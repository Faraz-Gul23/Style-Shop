  const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const themeToggle = document.getElementById('themeToggle');
        const cartCount = document.getElementById('cartCount');
        
        // Cart Data
        let cart = [];
        
        // Initialize the page
        function init() {
            // Load cart from localStorage if available
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCartCount();
                updateCartPage();
            }
            
            // Set up event listeners
            hamburger.addEventListener('click', toggleMenu);
            themeToggle.addEventListener('click', toggleTheme);
            
            // Check for saved theme preference
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
        
        // Toggle mobile menu
        function toggleMenu() {
            navMenu.classList.toggle('active');
        }
        
        // Toggle dark/light mode
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('darkMode', null);
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        // Show specific page
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show requested page
            document.getElementById(pageId).classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Update cart page if needed
            if (pageId === 'cart') {
                updateCartPage();
            }
        }
        
        // Show product detail page
        function showProductDetail(title, price) {
            document.getElementById('detailTitle').textContent = title;
            document.getElementById('detailPrice').textContent = `$${price.toFixed(2)}`;
            showPage('product-detail');
        }
        
        // Change product image on detail page
        function changeImage(src) {
            document.getElementById('mainImage').src = src;
        }
        
        // Quantity controls
        function increaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
        
        function decreaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        }
        
        // Add to cart from product detail page
        function addDetailToCart() {
            const title = document.getElementById('detailTitle').textContent;
            const priceText = document.getElementById('detailPrice').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const quantity = parseInt(document.getElementById('quantity').value);
            
            addToCart(title, price, quantity);
        }
        
        // Add item to cart
        function addToCart(title, price, quantity = 1) {
            // Check if item already in cart
            const existingItem = cart.find(item => item.title === title);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    title,
                    price,
                    quantity,
                    image: 'https://via.placeholder.com/100'
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            
            // Show confirmation
            alert(`${title} added to cart!`);
        }
        
        // Remove item from cart
        function removeFromCart(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartPage();
        }
        
        // Update cart quantity
        function updateCartQuantity(index, quantity) {
            if (quantity < 1) return;
            
            cart[index].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartPage();
        }
        
        // Update cart count badge
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // Update cart page
        function updateCartPage() {
            const cartItems = document.getElementById('cartItems');
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartShipping = document.getElementById('cartShipping');
            const cartTax = document.getElementById('cartTax');
            const cartTotal = document.getElementById('cartTotal');
            
            // Clear current items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart" style="padding: 40px; text-align: center;">Your cart is empty</div>';
                cartSubtotal.textContent = '$0.00';
                cartShipping.textContent = '$0.00';
                cartTax.textContent = '$0.00';
                cartTotal.textContent = '$0.00';
                return;
            }
            
            // Calculate totals
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal > 0 ? 10 : 0;
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + shipping + tax;
            
            // Update totals
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            cartShipping.textContent = `$${shipping.toFixed(2)}`;
            cartTax.textContent = `$${tax.toFixed(2)}`;
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add items to cart
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity(${index}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
        }
        
        // Checkout process
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your order! This is a demo, so no real transaction occurred.');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartPage();
            showPage('home');
        }
        
        // Newsletter subscription
        function subscribeNewsletter(event) {
            event.preventDefault();
            const email = event.target.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}!`);
            event.target.reset();
        }
        
        // Contact form submission
        function submitContactForm(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            alert('Thank you for your message! We will get back to you soon.');
            document.getElementById('contactForm').reset();
        }
        
        // Initialize the app
        init();