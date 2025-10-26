// Supabase Database Configuration
class WishlistDatabase {
    constructor() {
        // Get credentials from config file
        this.supabaseUrl = SUPABASE_CONFIG.url;
        this.supabaseKey = SUPABASE_CONFIG.anonKey;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=representation'
        };
        
        console.log('🔧 Database initialized with URL:', this.supabaseUrl);
        console.log('🔑 API Key (first 20 chars):', this.supabaseKey ? this.supabaseKey.substring(0, 20) + '...' : 'NOT SET');
    }

    // Get all wishlist items
    async getAllItems() {
        try {
            const url = `${this.supabaseUrl}/rest/v1/wishlist_items?select=*&order=created_at.desc`;
            console.log('📡 GET request to:', url);
            console.log('📋 Request headers:', this.headers);
            
            const response = await fetch(url, {
                headers: this.headers
            });
            
            console.log('📨 Response status:', response.status);
            console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const items = await response.json();
            console.log('✅ Successfully loaded items from database:', items.length);
            console.log('📊 Items data:', items);
            return items;
        } catch (error) {
            console.error('❌ Error loading items:', error);
            console.error('❌ Full error details:', error.message, error.stack);
            return [];
        }
    }

    // Add new wishlist item
    async addItem(item) {
        try {
            const requestBody = {
                name: String(item.name || ''),
                price: Number(item.price || 0),
                category: String(item.category || 'other'),
                reason: item.reason ? String(item.reason) : null,
                url: item.url ? String(item.url) : null,
                image_url: item.imageUrl ? String(item.imageUrl) : null,
                crossed_off: Boolean(item.crossedOff || false),
                created_at: new Date().toISOString()
            };
            
            // Don't include id in POST requests - let Supabase auto-generate it
            if (item.id && typeof item.id === 'number') {
                console.log('⚠️ Excluding ID from POST request (will be auto-generated):', item.id);
            }
            
            console.log('📤 POST request to add item:', requestBody);
            console.log('🌐 Full URL:', `${this.supabaseUrl}/rest/v1/wishlist_items`);
            console.log('📋 Headers being sent:', this.headers);
            
            const response = await fetch(`${this.supabaseUrl}/rest/v1/wishlist_items`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(requestBody)
            });

            console.log('📨 Add item response status:', response.status);
            console.log('📨 Add item response status text:', response.statusText);
            
            // Log all response headers
            const responseHeaders = {};
            for (let [key, value] of response.headers.entries()) {
                responseHeaders[key] = value;
            }
            console.log('📨 Response headers:', responseHeaders);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Add item error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            // Handle response carefully
            const responseText = await response.text();
            console.log('📨 Raw response text:', JSON.stringify(responseText));
            console.log('📨 Response text length:', responseText.length);
            
            let newItem;
            
            if (responseText.trim() === '') {
                console.log('✅ Item added (empty response), creating mock response');
                // Create a mock response since Supabase sometimes returns empty on success
                newItem = {
                    id: Date.now(), // Temporary ID
                    ...requestBody,
                    created_at: new Date().toISOString()
                };
            } else {
                try {
                    newItem = JSON.parse(responseText);
                    console.log('✅ Item successfully added to database:', newItem);
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError);
                    console.error('❌ Problematic response text:', responseText);
                    // Still create a mock response on parse error but successful HTTP status
                    newItem = {
                        id: Date.now(),
                        ...requestBody,
                        created_at: new Date().toISOString()
                    };
                    console.log('✅ Created fallback response due to parse error');
                }
            }
            
            return Array.isArray(newItem) ? newItem[0] : newItem;
        } catch (error) {
            console.error('❌ Error adding item:', error);
            console.error('❌ Full error details:', error.message, error.stack);
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
