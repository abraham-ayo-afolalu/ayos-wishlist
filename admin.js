// 90s RETRO WISHLIST ADMIN - Manage Your Items! 🌈

class RetroWishlistAdmin {
    constructor() {
        this.wishlist = [];
        this.isAuthenticated = false;
        this.adminPasswordHash = '9992126f56a77d9ca803ba422a7d84e917a02beadcce9e42d1549c6ef70ccae0';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.checkAuthState();
        this.bindEvents();
        if (this.isAuthenticated) {
            this.renderWishlist();
            this.updateStats();
        }
        
        // Add some 90s flair with random page elements
        this.addRetroEffects();
    }

    bindEvents() {
        const wishForm = document.getElementById('wishlistForm');
        const photoInput = document.getElementById('itemPhoto');
        const loginForm = document.getElementById('adminLoginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuthentication();
            });
        }
        
        if (wishForm) {
            wishForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Form submitted, isAuthenticated:', this.isAuthenticated);
                if (this.isAuthenticated) {
                    this.addWish();
                } else {
                    console.log('❌ Not authenticated, form submission blocked');
                }
            });
        } else {
            console.error('❌ wishlistForm not found!');
        }

        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.handlePhotoUpload(e);
            });
        }

        // Admin keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isAuthenticated && e.ctrlKey && e.key === 'Enter') {
                this.addWish();
            }
            if (this.isAuthenticated && e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.exportWishlist();
            }
        });
        
        // Direct event listeners are added in renderWishlist method
    }
    
    async handleAuthentication() {
        const passcode = document.getElementById('adminPasscode').value;
        const hashedInput = await this.hashPassword(passcode);
        
        if (hashedInput === this.adminPasswordHash) {
            this.isAuthenticated = true;
            this.saveAuthState();
            this.showAdminPanel();
            this.renderWishlist();
            this.updateStats();
            this.showAlert('Welcome back, Ayo! 😎', 'success');
        } else {
            this.showAlert('Invalid passcode! Access denied! 🚫', 'error');
            document.getElementById('adminPasscode').value = '';
        }
    }
    
    async hashPassword(password) {
        // Use Web Crypto API to hash password with SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    checkAuthState() {
        try {
            const stored = localStorage.getItem('ayo-admin-auth');
            if (stored) {
                this.isAuthenticated = JSON.parse(stored);
                if (this.isAuthenticated) {
                    this.showAdminPanel();
                    this.renderWishlist();
                    this.updateStats();
                    console.log('Restored admin session, wishlist rendered');
                }
            }
        } catch (e) {
            this.isAuthenticated = false;
        }
    }
    
    saveAuthState() {
        try {
            localStorage.setItem('ayo-admin-auth', JSON.stringify(this.isAuthenticated));
        } catch (e) {
            console.error('Could not save auth state:', e);
        }
    }
    
    showAdminPanel() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminControls').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'block';
        
        console.log('Admin panel shown, rendering wishlist...');
    }
    
    logout() {
        const confirmed = confirm('Are you sure you want to logout? 🚪\n\nYou will need to re-enter your passcode to access the admin panel again.');
        
        if (confirmed) {
            // Clear authentication state
            this.isAuthenticated = false;
            localStorage.removeItem('ayo-admin-auth');
            
            // Hide admin panel and controls
            document.getElementById('adminPanel').style.display = 'none';
            document.getElementById('adminControls').style.display = 'none';
            document.getElementById('mainContent').style.display = 'none';
            
            // Show login form
            document.getElementById('adminLogin').style.display = 'block';
            
            // Clear any form data for security
            this.clearForm();
            
            // Clear password field
            document.getElementById('adminPasscode').value = '';
            
            this.showAlert('Logged out successfully! 👋', 'info');
            
            // Focus on password field for easy re-login
            setTimeout(() => {
                document.getElementById('adminPasscode').focus();
            }, 100);
        }
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('photoPreview');
                const img = document.getElementById('previewImage');
                
                img.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    addWish() {
        console.log('🚀 addWish() called, isAuthenticated:', this.isAuthenticated);
        if (!this.isAuthenticated) {
            console.log('❌ Not authenticated, exiting addWish');
            return;
        }
        
        const form = document.getElementById('wishlistForm');
        const isEditing = form.dataset.editingId;
        
        const name = document.getElementById('itemName').value.trim();
        const priceInput = document.getElementById('itemPrice').value.trim();
        const url = document.getElementById('itemUrl').value.trim();
        const category = document.getElementById('itemCategory').value;
        const reason = document.getElementById('itemReason').value.trim();
        
        console.log('📊 Form data:', { name, priceInput, url, category, reason, isEditing });
        const photoInput = document.getElementById('itemPhoto');

        if (!name) {
            this.showAlert('Please enter an item name! 🤔', 'error');
            return;
        }

        // Parse price, default to 0 if invalid
        let price = 0;
        if (priceInput) {
            // Remove £ symbol and any non-numeric characters except decimal point
            const cleanPrice = priceInput.replace(/[£,]/g, '');
            price = parseFloat(cleanPrice) || 0;
        }

        const wish = {
            id: isEditing ? parseInt(isEditing) : Date.now(),
            name: name,
            price: price,
            url: url,
            category: category,
            reason: reason,
            imageUrl: null
        };

        // If editing, preserve existing image if no new photo uploaded
        if (isEditing) {
            const existingItem = this.wishlist.find(item => item.id === parseInt(isEditing));
            if (existingItem && existingItem.imageUrl) {
                wish.imageUrl = existingItem.imageUrl;
            }
        }

        // Handle photo if uploaded
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                wish.imageUrl = e.target.result;
                this.finalizeWish(wish, isEditing);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            // No photo uploaded, try to get link preview
            if (url && !isEditing) {
                this.fetchLinkPreview(wish);
            }
            this.finalizeWish(wish, isEditing);
        }
    }

    finalizeWish(wish, isEditing) {
        console.log('✨ finalizeWish called with:', wish, 'isEditing:', isEditing);
        console.log('📋 Current wishlist length before:', this.wishlist.length);
        
        if (isEditing) {
            const index = this.wishlist.findIndex(item => item.id === wish.id);
            if (index !== -1) {
                this.wishlist[index] = wish;
                console.log('✏️ Updated item at index', index);
            }
            this.showAlert('Item updated successfully! ✏️', 'success');
            this.cancelEdit(); // Exit edit mode
        } else {
            this.wishlist.push(wish);
            console.log('➕ Added new item, wishlist length now:', this.wishlist.length);
            this.showAlert('Item added to your showcase! 🎉', 'success');
            this.clearForm();
        }
        
        console.log('💾 About to save to storage...');
        this.saveToStorage();
        console.log('🎨 About to render wishlist...');
        this.renderWishlist();
        this.updateStats();
    }

    editWish(id) {
        console.log('editWish called with id:', id);
        const item = this.wishlist.find(wish => wish.id === id);
        if (!item) {
            console.error('Item not found with id:', id);
            return;
        }
        console.log('Found item to edit:', item);
        
        // Populate the form with current values
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrice').value = item.price.toString();
        document.getElementById('itemUrl').value = item.url || '';
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemReason').value = item.reason || '';
        
        // Show image preview if item has an image
        if (item.imageUrl) {
            document.getElementById('previewImage').src = item.imageUrl;
            document.getElementById('photoPreview').style.display = 'block';
        }
        
        // Change form to edit mode
        this.setEditMode(id);
        
        // Scroll to form
        document.getElementById('wishlistForm').scrollIntoView({ behavior: 'smooth' });
        
        this.showAlert('Editing item - modify fields and click UPDATE! ✏️', 'info');
    }
    
    setEditMode(id) {
        const form = document.getElementById('wishlistForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Store the ID we're editing
        form.dataset.editingId = id;
        
        // Change button text
        submitBtn.textContent = 'UPDATE ITEM!';
        submitBtn.style.background = 'linear-gradient(45deg, #ff6600, #ffaa00)';
        
        // Add cancel button
        let cancelBtn = document.getElementById('cancelEdit');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelEdit';
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'CANCEL EDIT';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.onclick = () => this.cancelEdit();
            submitBtn.parentNode.appendChild(cancelBtn);
        }
    }
    
    cancelEdit() {
        const form = document.getElementById('wishlistForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Reset form mode
        delete form.dataset.editingId;
        submitBtn.textContent = 'ADD TO WISHLIST!';
        submitBtn.style.background = '';
        
        // Remove cancel button
        const cancelBtn = document.getElementById('cancelEdit');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // Clear form
        this.clearForm();
        
        this.showAlert('Edit cancelled! 🚫', 'info');
    }

    removeWish(id) {
        console.log('removeWish called with id:', id);
        const item = this.wishlist.find(wish => wish.id === id);
        const itemName = item ? item.name : 'this item';
        console.log('Found item to remove:', item);
        
        // Add confirmation with 90s-style alert
        const confirmed = confirm(`Are you sure you want to remove "${itemName}" from your wishlist?`);
        
        if (confirmed) {
            this.wishlist = this.wishlist.filter(item => item.id !== id);
            this.saveToStorage();
            this.renderWishlist();
            this.updateStats();
            this.showAlert('Item removed from wishlist! 💔', 'info');
        }
    }

    renderWishlist() {
        console.log('renderWishlist called, wishlist length:', this.wishlist.length);
        const container = document.getElementById('wishlistItems');
        
        if (!container) {
            console.error('wishlistItems container not found!');
            return;
        }
        
        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No items in your wishlist yet! 🌈</p>
                    <p>Add some above to get started!</p>
                </div>
            `;
            return;
        }

        const itemsHTML = this.wishlist.map(item => {
            const categoryPlaceholders = {
                electronics: '💻',
                books: '📚',
                clothes: '👕',
                music: '🎵',
                experiences: '🎢',
                other: '🎁'
            };

            return `
                <div class="wish-item" data-id="${item.id}">
                    <div class="wish-item-preview">
                        ${item.imageUrl ? 
                            `<img src="${item.imageUrl}" alt="${item.name}" loading="lazy">` : 
                            `<div class="placeholder">${categoryPlaceholders[item.category]}</div>`
                        }
                    </div>
                    
                    <div class="wish-item-content">
                        <h3>${item.name}</h3>
                        <div class="price">£${item.price.toFixed(2)}</div>
                        <div class="category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                        ${item.reason ? `<div class="reason">${item.reason}</div>` : ''}
                        ${item.url ? `<a href="${item.url}" target="_blank" class="item-link">View Product 🔗</a>` : ''}
                    </div>
                    
                    <div class="wish-item-actions">
                        <button class="edit-btn" data-id="${item.id}" data-action="edit">Edit ✏️</button>
                        <button class="remove-btn" data-id="${item.id}" data-action="remove">Remove ❌</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = itemsHTML;
        
        // Add event listeners to buttons after rendering
        const editBtns = container.querySelectorAll('.edit-btn');
        const removeBtns = container.querySelectorAll('.remove-btn');
        
        console.log('Found edit buttons:', editBtns.length);
        console.log('Found remove buttons:', removeBtns.length);
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                console.log('Edit clicked for id:', id);
                this.editWish(id);
            });
        });
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                console.log('Remove clicked for id:', id);
                this.removeWish(id);
            });
        });
    }

    updateStats() {
        const itemCount = this.wishlist.length;
        const totalValue = this.wishlist.reduce((sum, item) => sum + item.price, 0);
        
        document.getElementById('itemCount').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
        document.getElementById('totalValue').textContent = `Total Value: £${totalValue.toFixed(2)}`;
    }

    clearForm() {
        const form = document.getElementById('wishlistForm');
        if (form) {
            form.reset();
            document.getElementById('photoPreview').style.display = 'none';
            
            // Clear edit mode if active
            if (form.dataset.editingId) {
                delete form.dataset.editingId;
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'ADD TO WISHLIST!';
                    submitBtn.style.background = '';
                }
                
                const cancelBtn = document.getElementById('cancelEdit');
                if (cancelBtn) {
                    cancelBtn.remove();
                }
            }
            
            // Only focus if form is visible
            if (form.offsetParent !== null) {
                document.getElementById('itemName').focus();
            }
        }
    }

    // Link preview functionality
    async fetchLinkPreview(wish) {
        // Simple fallback - try to extract domain for basic preview
        try {
            const url = new URL(wish.url);
            const domain = url.hostname.toLowerCase();
            
            // Common e-commerce site patterns
            if (domain.includes('amazon.')) {
                this.setFallbackImage(wish, '📦');
            } else if (domain.includes('ebay.')) {
                this.setFallbackImage(wish, '🛒');
            } else if (domain.includes('etsy.')) {
                this.setFallbackImage(wish, '🎨');
            } else if (domain.includes('target.') || domain.includes('walmart.')) {
                this.setFallbackImage(wish, '🏪');
            } else {
                this.setFallbackImage(wish, '🔗');
            }
        } catch (e) {
            console.log('Could not parse URL for preview');
        }
    }
    
    setFallbackImage(wish, emoji) {
        wish.fallbackEmoji = emoji;
    }

    saveToStorage() {
        try {
            localStorage.setItem('retro-wishlist-showcase', JSON.stringify(this.wishlist));
            console.log('💾 Saved wishlist to localStorage:', this.wishlist.length, 'items');
            console.log('💾 Saved data:', this.wishlist);
        } catch (e) {
            console.error('Could not save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            // Test localStorage functionality
            localStorage.setItem('test', 'working');
            const testValue = localStorage.getItem('test');
            localStorage.removeItem('test');
            console.log('🧪 localStorage test:', testValue === 'working' ? 'WORKING' : 'FAILED');
            
            const stored = localStorage.getItem('retro-wishlist-showcase');
            console.log('📦 Raw stored data:', stored);
            
            if (stored) {
                this.wishlist = JSON.parse(stored);
                console.log('📥 Loaded wishlist from storage:', this.wishlist.length, 'items');
                console.log('📊 Loaded data:', this.wishlist);
            } else {
                // Start with empty wishlist
                this.wishlist = [];
                console.log('🆕 No existing data found, starting with empty wishlist');
            }
        } catch (e) {
            console.error('❌ Could not load wishlist from storage:', e);
            this.wishlist = [];
        }
    }

    showAlert(message, type) {
        // Create a 90s-style notification
        const alert = document.createElement('div');
        alert.className = `retro-alert retro-alert-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff0000' : type === 'success' ? '#00ff00' : '#ffff00'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 15px 20px;
            border: 3px outset ${type === 'error' ? '#ff0000' : type === 'success' ? '#00ff00' : '#ffff00'};
            font-family: 'Press Start 2P', cursive;
            font-size: 0.7rem;
            z-index: 1000;
            animation: slideInAlert 0.3s ease;
            border-radius: 10px;
            box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(alert);

        // Remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOutAlert 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }

    addRetroEffects() {
        // Add some random 90s website elements
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInAlert {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutAlert {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .sparkle {
                position: fixed;
                pointer-events: none;
                color: #ff00ff;
                font-size: 20px;
                animation: sparkleAnim 2s ease-out forwards;
                z-index: 1000;
            }
            
            @keyframes sparkleAnim {
                0% {
                    opacity: 1;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1) rotate(180deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);

        // Add sparkle effect on clicks
        document.addEventListener('click', (e) => {
            this.createSparkle(e.clientX, e.clientY);
        });

        // Random background color changes for extra 90s fun
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 2 seconds
                this.flashColors();
            }
        }, 2000);
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }

    flashColors() {
        const container = document.querySelector('.container');
        const originalBorder = container.style.borderColor;
        
        container.style.borderColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)];
        
        setTimeout(() => {
            container.style.borderColor = originalBorder;
        }, 200);
    }

    // Export wishlist as text
    exportWishlist() {
        if (this.wishlist.length === 0) {
            this.showAlert('Your wishlist is empty!', 'error');
            return;
        }

        let exportText = `🌟 MY TOTALLY AWESOME WISHLIST 🌟\n`;
        exportText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        
        this.wishlist.forEach((item, index) => {
            exportText += `${index + 1}. ${item.name}\n`;
            if (item.price > 0) exportText += `   Price: £${item.price.toFixed(2)}\n`;
            if (item.url) exportText += `   URL: ${item.url}\n`;
            exportText += `   Category: ${item.category}\n`;
            if (item.reason) exportText += `   Why I want it: ${item.reason}\n`;
            exportText += `   Added: ${item.dateAdded}\n\n`;
        });
        
        exportText += `Total Items: ${this.wishlist.length}\n`;
        exportText += `Total Value: £${this.wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}\n`;
        exportText += `\n🌈 Keep dreaming! 🌈`;

        // Create download
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-awesome-wishlist.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showAlert('Wishlist exported! 📄', 'success');
    }
}

// Initialize the admin app when the page loads
let wishlistAdmin;

document.addEventListener('DOMContentLoaded', () => {
    wishlistAdmin = new RetroWishlistAdmin();
    
    console.log('🔐 Admin panel initialized! Welcome to the control center! 🔐');
    console.log('💡 Pro tip: Press Ctrl+Enter to quickly add items!');
    console.log('💡 Secret: Press Ctrl+E to export your wishlist!');
    console.log('💡 Remember: Keep your admin credentials secure!');
});
