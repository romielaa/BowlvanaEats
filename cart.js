/**
 * Bowlvana E-commerce Website
 * CIT2011 Web Programming - Group Assignment #1
 * 
 * Group Members:
 * - Romiela Cooke (2209989) - Founder & CEO
 * - Delano Wright (2210185) - Head Chef & Designer
 * - Tareke Williams (23010976) - Sales Representative
 * - Joshua Williams (23010988) - Lead Developer
 * 
 * File: cart.js
 * Purpose: Handles all shopping cart and order processing functionality
 */

/**
 * Question 2: Product Catalogue Implementation
 * - Creates array of product objects with required properties
 * - Maintains product list in localStorage
 * - Enables dynamic product display
 * - Implements Add to Cart functionality
 */
// Product Configurations
const products = {
    featuredBowls: [
        {
            name: 'Blue Lagoon',
            price: 950.00,
            image: 'assets/images/bluelagoon.png',
            description: 'Pure açaí blend topped with granola, sliced banana and blueberry',
            calories: 350
        },
        {
            id: 'coral-kiss',
            name: 'Coral Kiss',
            price: 650.00,
            image: 'assets/images/swirl2.png',
            description: 'Refreshing blend with mango, pineapple, and coconut flakes',
            calories: 350
        },
        {
            id: 'markono',
            name: 'Markono',
            price: 750.00,
            image: 'assets/images/purple1.png',
            description: 'Rich açaí topped with almonds, pecans, and honey drizzle',
            calories: 350
        },
        {
            id: 'emerald-dew',
            name: 'Emerald Dew',
            price: 850.00,
            image: 'assets/images/green.png',
            description: 'Spirulina blend with kiwi, matcha, and chia seeds',
            calories: 350
        }
    ],
    quickBowls: [
            {
                id: 'merry-berry',
                name: 'Merry Berry',
                price: 900.00,
                image: 'assets/images/merryberry.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'blue-majik',
                name: 'Blue Majik',
                price: 750.00,
                image: 'assets/images/bluemajik.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'mystic-moon',
                name: 'Mystic Moon',
                price: 850.00,
                image: 'assets/images/swirl.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'moonwave',
                name: 'Moonwave',
                price: 900.00,
                image: 'assets/images/mixed.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'kiwi-kiss',
                name: 'Kiwi Kiss',
                price: 850.00,
                image: 'assets/images/kiwi.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'choco-charm',
                name: 'Choco Charm',
                price: 750.00,
                image: 'assets/images/fullset.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: true
            },
            {
                id: 'bombom',
                name: 'BOMBOM',
                price: 750.00,
                image: 'assets/images/berry5.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'dawn-delight',
                name: 'Dawn Delight',
                price: 950.00,
                image: 'assets/images/dragon.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            },
            {
                id: 'nutty-nova',
                name: 'Nutty Nova',
                price: 850.00,
                image: 'assets/images/cocoa.png',
                description: 'Pure açaí blend topped with granola, sliced banana, and blueberries',
                calories: 350,
                bestSeller: false
            }

],
};

/**
 * Question 3: Cart Page Implementation
 * - Lists cart items with details
 * - Enables item removal and quantity updates
 * - Calculates total price
 * - Implements cart management buttons
 */
// Cart state management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    let discount = 0;
    
    // Apply $500 discount for orders over $1,500
    if (subtotal >= 1500) {
        discount = 500;
        showDiscountAlert();
    } else {
        hideDiscountAlert();
    }
    
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.15; // 15% tax
    const total = discountedSubtotal + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        discountedSubtotal: discountedSubtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Show discount alert
function showDiscountAlert() {
    const priceBreakdown = document.querySelector('.price-breakdown');
    let discountAlert = document.querySelector('.discount-alert');
    
    if (!discountAlert && priceBreakdown) {
        discountAlert = document.createElement('div');
        discountAlert.className = 'discount-alert';
        discountAlert.innerHTML = `
            <i class="fas fa-gift"></i>
            <span>Congratulations! A $500 discount has been applied to your order!</span>
        `;
        priceBreakdown.insertAdjacentElement('beforebegin', discountAlert);
    }
    
    const discountRow = document.querySelector('.discount-row');
    if (discountRow) {
        discountRow.style.display = 'flex';
    }
}

// Hide discount alert
function hideDiscountAlert() {
    const discountAlert = document.querySelector('.discount-alert');
    if (discountAlert) {
        discountAlert.remove();
    }
    
    const discountRow = document.querySelector('.discount-row');
    if (discountRow) {
        discountRow.style.display = 'none';
    }
}

// Update totals display with discount
function updateTotalsDisplay() {
    const totals = calculateTotals();
    const priceBreakdown = document.querySelector('.price-breakdown');
    if (priceBreakdown) {
        priceBreakdown.innerHTML = `
            <div class="price-row">
                <span>Subtotal</span>
                <span>J$${totals.subtotal}</span>
            </div>
            <div class="price-row discount-row" ${parseFloat(totals.discount) > 0 ? '' : 'style="display: none;"'}>
                <span>Discount</span>
                <span>-J$${totals.discount}</span>
            </div>
            <div class="price-row">
                <span>Tax (15%)</span>
                <span>J$${totals.tax}</span>
            </div>
            <div class="price-row total-row">
                <span>Total</span>
                <span>J$${totals.total}</span>
            </div>
        `;
    }
}

// Handle payment method change
document.addEventListener('DOMContentLoaded', function() {
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    const amountPaidContainer = document.getElementById('amount-paid-container');

    paymentInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'cash') {
                amountPaidContainer.style.display = 'block';
            } else {
                amountPaidContainer.style.display = 'none';
            }
        });
    });

    // Initialize cart
    updateCartCount();
    updateCartDisplay();
});

// Function to display thank you message
function displayThankYouMessage(orderDetails) {
    const thankYouMessage = document.getElementById('thank-you-message');
    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.innerHTML = `
            <div class="order-success">
                <i class="fas fa-check-circle"></i>
                <h3>Thank you for your order!</h3>
                <p class="order-number">Order #${orderDetails.orderId}</p>
                <p>Your order has been received and will be delivered to ${orderDetails.deliveryArea}.</p>
                <p>Payment method: ${orderDetails.paymentMethod}</p>
                <div class="order-details">
                    <h4>Order Summary:</h4>
                    <div class="order-items">
                        ${orderDetails.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>J$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-totals">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>J$${orderDetails.totals.subtotal}</span>
                        </div>
                        <div class="total-row">
                            <span>Tax (15%):</span>
                            <span>J$${orderDetails.totals.tax}</span>
                        </div>
                        <div class="total-row final-total">
                            <span>Total:</span>
                            <span>J$${orderDetails.totals.total}</span>
                        </div>
                    </div>
                </div>
                <p>You will receive a confirmation email shortly at ${orderDetails.customerEmail}</p>
                <button onclick="window.location.href='menu.html'" class="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        `;
    }
}
// Initialize cart count and display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    initializeCartIcon();
});

// Function to initialize cart icon
function initializeCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/cart.html';
        });
    }
}

// Function to add item to cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image || `assets/images/${name.toLowerCase().replace(/\s+/g, '')}.png`,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification(`${name} added to cart!`);
}

// Function to update cart count
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount.toString();
    });
}

// Function to update quantity
function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        } else {
            item.quantity = newQuantity;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

// Function to update cart display (for cart page)
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    
    if (cartContainer) cartContainer.style.display = 'block';
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">J$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-number">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-total">
                J$${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')" aria-label="Remove ${item.name} from cart">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateTotalsDisplay();
}
// Function to format TRN with dashes
function formatTRN(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');
    
    // Add dashes after every 3 digits
    if (value.length > 3) {
        value = value.slice(0,3) + '-' + value.slice(3);
    }
    if (value.length > 7) {
        value = value.slice(0,7) + '-' + value.slice(7);
    }
    
    // Limit to 11 characters (XXX-XXX-XXX)
    value = value.slice(0, 11);
    
    // Update input value
    input.value = value;
}

// Add event listener when document loads
document.addEventListener('DOMContentLoaded', function() {
    const trnInput = document.getElementById('customer-trn');
    if (trnInput) {
        // Format as user types
        trnInput.addEventListener('input', function(e) {
            formatTRN(this);
        });

        // Handle pasting
        trnInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/\D/g, '');
            
            // Set the input value and trigger formatting
            this.value = numbersOnly;
            formatTRN(this);
        });
    }
});
// Function to remove item from cart
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showNotification(`${name} removed from cart`);
    }
}
/**
 * Question 4: Checkout Page Implementation
 * - Displays cart summary with total cost
 * - Collects and validates shipping details
 * - Processes checkout and generates invoice
 */

// Company details object
const COMPANY_DETAILS = {
    name: "Bowlvana",
    trn: "001-234-567",
    address: "Southern Cross, Fairview Montego Bay, Jamaica",
    phone: "+1 (876) 344-9461",
    email: "orders@bowlvana.com"
};

// Get user's TRN from registration data based on email
function getUserTRNByEmail(email) {
    const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const user = registrationData.find(user => user.email === email);
    return user ? user.trn : null;
}

function proceedToCheckout() {
    const deliveryArea = document.getElementById('delivery-area')?.value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const customerName = document.getElementById('customer-name')?.value;
    const customerEmail = document.getElementById('customer-email')?.value;
    const customerAddress = document.getElementById('customer-address')?.value;
    const customerTrn = document.getElementById('customer-trn')?.value;
    
    // Validation checks...
    if (cart.length === 0) {
        showNotification('Your cart is empty. Please add items before checking out.', 'error');
        return;
    }

    if (!customerName || !customerAddress || !customerEmail) {
        showNotification('Please enter your shipping details', 'error');
        highlightMissingFields(['customer-name', 'customer-address', 'customer-email']);
        return;
    }

    // Calculate totals
    const totals = calculateTotals();
    
    // Create order details
    const orderDetails = {
        orderId: generateOrderId(),
        date: new Date().toISOString(),
        trn: customerTrn,
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        deliveryArea: deliveryArea,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            image: item.image
        })),
        totals: totals,
        customerTRN: customerTrn,  
        status: 'Confirmed'
    };

    // Save to order history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orderHistory.unshift(orderDetails);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    // Generate invoice with TRN
    const invoice = {
        invoiceNumber: generateInvoiceNumber(),
        orderNumber: orderDetails.orderId,
        dateIssued: new Date().toISOString(),
        customerTRN: customerTrn, 
        customerInfo: {
            name: customerName,
            email: customerEmail,
            address: customerAddress,
            deliveryArea: deliveryArea,
        },
        items: orderDetails.items,
        calculations: totals,
        paymentMethod: paymentMethod,
        status: "Paid"
    };
    // Display thank you message
    displayThankYouMessage(orderDetails);
}
    // Save invoice
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices') || '[]');
    allInvoices.unshift(invoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

    // Clear cart
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();

    /**
 * Question 5: Invoice Generation Implementation
 * - Generates detailed invoice with all required information
 * - Stores invoice in appropriate localStorage locations
 * - Manages invoice display and email notifications
 */


    // Generate order details
    const userTRN = getUserTRNByEmail(customerEmail);
    const orderDetails = {
        orderId: generateOrderId(),
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            image: item.image
        })),
        deliveryArea: deliveryArea,
        customerEmail: customerEmail,
        paymentMethod: paymentMethod,
        totals: totals,
        orderDate: new Date().toISOString(),
        status: 'Confirmed'
    };

    // Display thank you message
    displayThankYouMessage(orderDetails);

function generateOrderId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  // Removed similar looking characters
    const length = 8;  // Will generate 8 characters
    let result = 'BV-';  // Prefix for Bowlvana
    
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return result;
}

// Highlight missing fields
function highlightMissingFields(fieldIds) {
    fieldIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.borderColor = '#ff4444';
            setTimeout(() => {
                element.style.borderColor = '';
            }, 3000);
        }
    });
}

    function showConfirmationNotification(message, onConfirm) {
        const notification = document.createElement('div');
        notification.className = 'notification confirm';
        notification.innerHTML = `
            <i class="fas fa-question-circle"></i>
            <span>${message}</span>
            <div class="notification-actions">
                <button class="confirm-no">No, continue checkout</button>
                <button class="confirm-yes">Yes, return to menu</button>
            </div>
        `;
        document.body.appendChild(notification);
    
        // Add event listeners
        const yesButton = notification.querySelector('.confirm-yes');
        const noButton = notification.querySelector('.confirm-no');
    
        function removeNotification() {
            notification.remove();
        }
    
        yesButton.addEventListener('click', () => {
            removeNotification();
            window.location.href = 'menu.html';  // Redirect to menu.html
        });
    
        noButton.addEventListener('click', removeNotification);
    }
    
    function cancelCheckout() {
        showConfirmationNotification('Are you sure you want to cancel checkout? Your cart items will be preserved.');
    }
    // Calculate order totals
    const totals = calculateTotals();

// Generate invoice
function generateInvoice(orderDetails) {
    const invoice = {
        invoiceNumber: generateInvoiceNumber(),
        companyDetails: COMPANY_DETAILS,
        dateIssued: new Date().toISOString(),
        orderNumber: orderDetails.orderId,
        customerInfo: {
            deliveryArea: orderDetails.deliveryArea
        },
        items: orderDetails.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            discount: 0, // Can be modified for future discount implementation
            total: item.price * item.quantity
        })),
        calculations: {
            subtotal: orderDetails.totals.subtotal,
            tax: orderDetails.totals.tax,
            total: orderDetails.totals.total
        },
        paymentMethod: orderDetails.paymentMethod,
        status: 'Paid',
        notes: "Thank you for choosing Bowlvana! Your satisfaction is our priority."
    };

    // Save invoice to localStorage
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices') || '[]');
    allInvoices.unshift(invoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

    return invoice;
}

// Generate unique invoice number
function generateInvoiceNumber() {
    const prefix = 'INV';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Generate unique order number
function generateOrderNumber() {
    const prefix = 'BV';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Save order to history
function saveOrderToHistory(orderDetails) {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orderHistory.unshift(orderDetails);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// Clear cart and update UI
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    updateCartDisplay();
}
// Add clear all cart function
function clearAllCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared successfully');
}

// Add close cart function
function closeCart() {
    window.location.href = 'menu.html';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Update cart display
    updateCartCount();
    updateCartDisplay();
});

// Export necessary functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.proceedToCheckout = proceedToCheckout;
window.clearAllCart = clearAllCart;
window.closeCart = closeCart;
window.cancelCheckout = cancelCheckout;