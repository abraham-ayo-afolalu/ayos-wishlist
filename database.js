// Supabase Database Configuration
class WishlistDatabase {
    constructor() {
        // Get credentials from config file
        this.supabaseUrl = SUPABASE_CONFIG.url;
        this.supabaseKey = SUPABASE_CONFIG.anonKey;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
        };
    }

    // Get all wishlist items
    async getAllItems() {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items?select=*&order=created_at.desc`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const items = await response.json();
            console.log('📥 Loaded items from database:', items.length);
            return items;
        } catch (error) {
            console.error('❌ Error loading items:', error);
            return [];
        }
    }

    // Add new wishlist item
    async addItem(item) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    reason: item.reason || null,
                    url: item.url || null,
                    image_url: item.imageUrl || null,
                    crossed_off: item.crossedOff || false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newItem = await response.json();
            console.log('✅ Item added to database:', newItem);
            return newItem[0];
        } catch (error) {
            console.error('❌ Error adding item:', error);
            throw error;
        }
    }

    // Update existing wishlist item
    async updateItem(id, item) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items?id=eq.${id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    reason: item.reason || null,
                    url: item.url || null,
                    image_url: item.imageUrl || null,
                    crossed_off: item.crossedOff || false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('✏️ Item updated in database');
            return true;
        } catch (error) {
            console.error('❌ Error updating item:', error);
            throw error;
        }
    }

    // Delete wishlist item
    async deleteItem(id) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items?id=eq.${id}`, {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('🗑️ Item deleted from database');
            return true;
        } catch (error) {
            console.error('❌ Error deleting item:', error);
            throw error;
        }
    }

    // Toggle crossed off status
    async toggleCrossedOff(id, crossedOff) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items?id=eq.${id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({
                    crossed_off: crossedOff
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('✅ Item status updated in database');
            return true;
        } catch (error) {
            console.error('❌ Error updating status:', error);
            throw error;
        }
    }
}

// Create global database instance
const wishlistDB = new WishlistDatabase();
