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
 * File: analytics.js
 * Purpose: Handles user analytics and invoice management functionality
 */

/**
 * Question 6.a: ShowUserFrequency Implementation
 * Requirements:
 * - Display user demographics by gender
 * - Show age group distribution
 * - Present data in dashboard format
 */
function ShowUserFrequency() {
    // Get registered users from localStorage
    const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    
    // Gender Analysis
    const genderFrequency = registrationData.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
    }, {});

    // Age Group Analysis
    const ageGroups = {
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0
    };

    registrationData.forEach(user => {
        const birthDate = new Date(user.dob);
        const age = calculateAge(birthDate);
        
        if (age >= 18 && age <= 25) ageGroups['18-25']++;
        else if (age > 25 && age <= 35) ageGroups['26-35']++;
        else if (age > 35 && age <= 50) ageGroups['36-50']++;
        else if (age > 50) ageGroups['50+']++;
    });

    // Display on Dashboard
    displayUserFrequencyDashboard(genderFrequency, ageGroups);

    // Also return the data
    return {
        genderFrequency,
        ageGroups
    };
}

// Helper function to calculate age
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Function to display the dashboard
function displayUserFrequencyDashboard(genderData, ageData) {
    const dashboard = document.createElement('div');
    dashboard.className = 'user-frequency-dashboard';
    
    // Create HTML content
    dashboard.innerHTML = `
        <div class="dashboard-container">
            <h2>User Demographics Dashboard</h2>
            
            <div class="dashboard-section">
                <h3>Gender Distribution</h3>
                <div class="gender-stats">
                    ${Object.entries(genderData).map(([gender, count]) => `
                        <div class="stat-card">
                            <h4>${gender}</h4>
                            <p class="stat-number">${count}</p>
                            <p class="stat-percentage">${((count / Object.values(genderData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="dashboard-section">
                <h3>Age Group Distribution</h3>
                <div class="age-stats">
                    ${Object.entries(ageData).map(([range, count]) => `
                        <div class="stat-card">
                            <h4>${range}</h4>
                            <p class="stat-number">${count}</p>
                            <p class="stat-percentage">${((count / Object.values(ageData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add to page
    const existingDashboard = document.querySelector('.user-frequency-dashboard');
    if (existingDashboard) {
        existingDashboard.remove();
    }
    document.body.appendChild(dashboard);
}
/**
 * Question 6.b: ShowInvoices Implementation
 * Requirements:
 * - Display all invoices
 * - Enable TRN-based search
 * - Log results to console
 */
function ShowInvoices() {
    // Get all invoices from localStorage
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    
    // Log all invoices to console
    console.log('All Invoices:', allInvoices);

    // Create search functionality and display
    const dashboard = document.createElement('div');
    dashboard.className = 'invoices-dashboard';
    
    dashboard.innerHTML = `
        <div class="dashboard-container">
            <h2>Invoices Dashboard</h2>
            
            <div class="search-section">
                <input type="text" 
                id="trnSearch" 
                placeholder="Search by TRN (format: XXX-XXX-XXX)"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                class="search-input">
                <button onclick="searchInvoicesByTRN()" class="search-btn">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
            
            <div class="invoices-list">
                ${allInvoices.length > 0 ? 
                    allInvoices.map(invoice => createInvoiceCard(invoice)).join('') : 
                    '<p class="no-invoices">No invoices found</p>'}
            </div>
        </div>
    `;

    // Add to page
    const existingDashboard = document.querySelector('.invoices-dashboard');
    if (existingDashboard) {
        existingDashboard.remove();
    }
    document.body.appendChild(dashboard);
}

// Helper function to create invoice card
function createInvoiceCard(invoice) {
    return `
        <div class="invoice-card">
            <div class="invoice-header">
                <h3>Invoice #${invoice.invoiceNumber}</h3>
                <span class="invoice-date">${new Date(invoice.dateIssued).toLocaleDateString()}</span>
            </div>
            <div class="invoice-details">
                <p><strong>Order #:</strong> ${invoice.orderNumber}</p>
                <p><strong>Customer:</strong> ${invoice.customerInfo.name || 'N/A'}</p>
                <p><strong>Total Amount:</strong> J$${invoice.calculations.total}</p>
                <p><strong>Status:</strong> <span class="status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
            </div>
            <div class="invoice-items-summary">
                <h4>Items (${invoice.items.length})</h4>
                <div class="items-list">
                    ${invoice.items.map(item => `
                        <div class="item-row">
                            <span>${item.name} x${item.quantity}</span>
                            <span>J$${item.total.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Function to search invoices by TRN
function searchInvoicesByTRN() {
    const searchTRN = document.getElementById('trnSearch').value;
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    
    // Validate TRN format
    const trnRegex = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnRegex.test(searchTRN)) {
        alert('Please enter a valid TRN in format XXX-XXX-XXX');
        return;
    }

    // Filter invoices by TRN
    const filteredInvoices = allInvoices.filter(invoice => 
        invoice.customerInfo.trn === searchTRN
    );

    // Log filtered results to console
    console.log('Search Results for TRN ${searchTRN}:', filteredInvoices);

    // Update display
    const invoicesList = document.querySelector('.invoices-list');
    if (invoicesList) {
        invoicesList.innerHTML = filteredInvoices.length > 0 ?
            filteredInvoices.map(invoice => createInvoiceCard(invoice)).join('') :
            '<p class="no-invoices">No invoices found for this TRN</p>';
    }
}


/**
 * Question 6.c: GetUserInvoices Implementation
 * Requirements:
 * - Filter invoices by user TRN
 * - Display user-specific invoices
 * - Show invoice statistics
 */
function GetUserInvoices(userTRN) {
    // Get registration data to validate TRN
    const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userExists = registrationData.some(user => user.trn === userTRN);
    
    if (!userExists) {
        alert('User with this TRN does not exist');
        return;
    }

    // Get all invoices from localStorage
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    
    // Filter invoices for the specific user
    const userInvoices = allInvoices.filter(invoice => 
        invoice.customerInfo.trn === userTRN
    );

    // Display user's invoices
    const dashboard = document.createElement('div');
    dashboard.className = 'user-invoices-dashboard';
    
    dashboard.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h2>Invoices for TRN: ${userTRN}</h2>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="user-stats">
                <div class="stat-card">
                    <h4>Total Invoices</h4>
                    <p>${userInvoices.length}</p>
                </div>
                <div class="stat-card">
                    <h4>Total Spent</h4>
                    <p>J$${userInvoices.reduce((sum, inv) => sum + parseFloat(inv.calculations.total), 0).toFixed(2)}</p>
                </div>
                <div class="stat-card">
                    <h4>Average Order Value</h4>
                    <p>J$${userInvoices.length ? (userInvoices.reduce((sum, inv) => sum + parseFloat(inv.calculations.total), 0) / userInvoices.length).toFixed(2) : '0.00'}</p>
                </div>
            </div>

            <div class="invoices-timeline">
                ${userInvoices.length > 0 ? 
                    userInvoices.map((invoice, index) => `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="invoice-card">
                                    <div class="invoice-header">
                                        <h3>Invoice #${invoice.invoiceNumber}</h3>
                                        <span class="invoice-date">${new Date(invoice.dateIssued).toLocaleDateString()}</span>
                                    </div>
                                    <div class="invoice-details">
                                        <p><strong>Order #:</strong> ${invoice.orderNumber}</p>
                                        <p><strong>Amount:</strong> J$${invoice.calculations.total}</p>
                                        <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
                                    </div>
                                    <div class="invoice-items">
                                        <h4>Items:</h4>
                                        <ul>
                                            ${invoice.items.map(item => `
                                                <li>${item.name} x${item.quantity} - J$${item.total.toFixed(2)}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    <button onclick="printInvoice('${invoice.invoiceNumber}')" class="print-btn">
                                        <i class="fas fa-print"></i> Print Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('') : 
                    '<p class="no-invoices">No invoices found for this user</p>'
                }
            </div>
        </div>
    `;

    // Add to page
    const existingDashboard = document.querySelector('.user-invoices-dashboard');
    if (existingDashboard) {
        existingDashboard.remove();
    }
    document.body.appendChild(dashboard);

    // Return the invoices array for potential further use
    return userInvoices;
}

// Helper function to print individual invoice
function printInvoice(invoiceNumber) {
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    const invoice = allInvoices.find(inv => inv.invoiceNumber === invoiceNumber);
    
    if (!invoice) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice #${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .invoice-container { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .details { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .totals { text-align: right; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <h1>Invoice #${invoice.invoiceNumber}</h1>
                        <p>Date: ${new Date(invoice.dateIssued).toLocaleDateString()}</p>
                    </div>
                    <div class="details">
                        <h3>Order Details:</h3>
                        <p>Order Number: ${invoice.orderNumber}</p>
                        <p>Payment Method: ${invoice.paymentMethod}</p>
                    </div>
                    <table class="items-table">
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>J$${item.price.toFixed(2)}</td>
                                <td>J$${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <div class="totals">
                        <p>Subtotal: J$${invoice.calculations.subtotal}</p>
                        <p>Tax (15%): J$${invoice.calculations.tax}</p>
                        <p><strong>Total: J$${invoice.calculations.total}</strong></p>
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

