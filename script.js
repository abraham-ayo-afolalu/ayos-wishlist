// 90s RETRO WISHLIST SHOWCASE - Public View Only! 🌈

class RetroWishlistShowcase {
    constructor() {
        this.wishlist = [];
        this.filteredWishlist = [];
        this.currentFilter = 'all';
        this.currentSort = 'none';
        this.init();
    }

    async init() {
        await this.loadFromStorage();
        this.bindEvents();
        this.applyFiltersAndSort();
        this.renderWishlist();
        this.updateStats();
        
        // Add some 90s flair with random page elements
        this.addRetroEffects();
    }
    
    bindEvents() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceSort = document.getElementById('priceSort');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.applyFiltersAndSort();
                this.renderWishlist();
                this.updateStats();
            });
        }
        
        if (priceSort) {
            priceSort.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFiltersAndSort();
                this.renderWishlist();
                this.updateStats();
            });
        }
    }

    // No admin functionality in public view

    // Admin functions moved to admin.js

    // Remove functionality only available in admin panel
    
    applyFiltersAndSort() {
        // Filter by category
        if (this.currentFilter === 'all') {
            this.filteredWishlist = [...this.wishlist];
        } else {
            this.filteredWishlist = this.wishlist.filter(item => item.category === this.currentFilter);
        }
        
        // Sort by price
        if (this.currentSort === 'low-high') {
            this.filteredWishlist.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'high-low') {
            this.filteredWishlist.sort((a, b) => b.price - a.price);
        }
    }
    
    async toggleCrossOff(itemId, event) {
        event.preventDefault();
        event.stopPropagation();
        
        const item = this.wishlist.find(item => item.id === itemId);
        if (item) {
            try {
                const newStatus = !item.crossed_off;
                await wishlistDB.toggleCrossedOff(itemId, newStatus);
                item.crossed_off = newStatus;
                this.renderWishlist();
                console.log('✅ Item status updated in database');
            } catch (error) {
                console.error('❌ Failed to update item status:', error);
            }
        }
    }

    renderWishlist() {
        const container = document.getElementById('wishlistItems');
        
        if (this.filteredWishlist.length === 0) {
            if (this.wishlist.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <p>The wishlist is currently empty! 🌈</p>
                        <p>Check back soon for awesome items!</p>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="empty-state">
                        <p>No items match your current filter! 🔍</p>
                        <p>Try selecting a different category or sorting option.</p>
                    </div>
                `;
            }
            return;
        }

        const itemsHTML = this.filteredWishlist.map(item => {
            const categoryPlaceholders = {
                electronics: '💻',
                books: '📚',
                clothes: '👕',
                music: '🎵',
                experiences: '🎢',
                other: '🪄'
            };
            
            const itemUrl = item.url || '#';
            const crossedClass = (item.crossedOff || item.crossed_off) ? 'crossed-off' : '';

            return `
                <a href="${itemUrl}" target="_blank" class="wish-item ${crossedClass}" data-id="${item.id}">
                    <div class="wish-item-preview">
                        ${(item.imageUrl || item.image_url) ? 
                            `<img src="${item.imageUrl || item.image_url}" alt="${item.name}" loading="lazy">` : 
                            `<div class="placeholder">${categoryPlaceholders[item.category]}</div>`
                        }
                    </div>
                    
                    <div class="wish-item-content">
                        <h3>${item.name}</h3>
                        ${item.price > 0 ? `<div class="price">£${item.price.toFixed(2)}</div>` : ''}
                        <div class="category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                        ${item.reason ? `<div class="reason">${item.reason}</div>` : ''}
                    </div>
                    
                    <div class="wish-item-actions">
                        <button class="cross-off-btn" onclick="wishlistApp.toggleCrossOff(${item.id}, event)">
                            ${(item.crossedOff || item.crossed_off) ? 'UNDO' : 'GOT IT!'}
                        </button>
                    </div>
                </a>
            `;
        }).join('');

        container.innerHTML = itemsHTML;
    }

    updateStats() {
        const itemCount = this.wishlist.length;
        document.getElementById('itemCount').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in my wishlist`;
    }

    clearForm() {
        const form = document.getElementById('wishlistForm');
        if (form) {
            form.reset();
            document.getElementById('itemName').focus();
        }
    }

    // Authentication handled separately in admin panel
    
    // Link preview functionality
    async fetchLinkPreview(wish) {
        // Simple fallback - try to extract domain for basic preview
        // In a real app, you'd use a proper link preview service
        try {
            const url = new URL(wish.url);
            const domain = url.hostname.toLowerCase();
            
            // Common e-commerce site patterns
            if (domain.includes('amazon.')) {
                // Amazon product - try to get image from page
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
        // For now, just use emoji as fallback
        // In production, you'd implement proper image extraction
        wish.fallbackEmoji = emoji;
    }

    saveToStorage() {
        try {
            localStorage.setItem('retro-wishlist-showcase', JSON.stringify(this.wishlist));
        } catch (e) {
            console.error('Could not save to localStorage:', e);
        }
    }

    async loadFromStorage() {
        try {
            console.log('📥 Loading wishlist from database...');
            this.wishlist = await wishlistDB.getAllItems();
            console.log('✅ Public site loaded from database:', this.wishlist.length, 'items');
        } catch (e) {
            console.error('❌ Could not load from database:', e);
            this.wishlist = [];
        }
    }
    
    // Admin state not needed in public view

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

    // Export wishlist as text (bonus feature)
    exportWishlist() {
        if (this.wishlist.length === 0) {
            this.showAlert('Your wishlist is empty!', 'error');
            return;
        }

        let exportText = `🌟 MY TOTALLY AWESOME WISHLIST 🌟\n`;
        exportText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        
        this.wishlist.forEach((item, index) => {
            exportText += `${index + 1}. ${item.name}\n`;
            if (item.price > 0) exportText += `   Price: $${item.price.toFixed(2)}\n`;
            exportText += `   Category: ${item.category}\n`;
            exportText += `   Added: ${item.dateAdded}\n\n`;
        });
        
        exportText += `Total Items: ${this.wishlist.length}\n`;
        exportText += `Total Value: $${this.wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}\n`;
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

// Initialize the public showcase when the page loads
let wishlistApp;

document.addEventListener('DOMContentLoaded', () => {
    wishlistApp = new RetroWishlistShowcase();
    
    console.log('🌟 Welcome to the most radical wishlist showcase! 🌟');
    console.log('💡 This is the public view - no editing allowed!');
    console.log('💡 Admin? Go to admin.html to manage your wishlist!');
});
