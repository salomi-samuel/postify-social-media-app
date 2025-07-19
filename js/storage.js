// Enhanced storage management
class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
        this.version = '1.0.0';
        this.maxSize = 5 * 1024 * 1024; // 5MB limit
    }
    
    checkAvailability() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    getStorageSize() {
        if (!this.isAvailable) return 0;
        
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
    
    set(key, value) {
        if (!this.isAvailable) return false;
        
        try {
            const serialized = JSON.stringify(value);
            
            // Check if adding this item would exceed storage limit
            if (this.getStorageSize() + serialized.length > this.maxSize) {
                this.cleanup();
                if (this.getStorageSize() + serialized.length > this.maxSize) {
                    throw new Error('Storage limit exceeded');
                }
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;
        
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage retrieval error:', e);
            return defaultValue;
        }
    }
    
    remove(key) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage removal error:', e);
            return false;
        }
    }
    
    clear() {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
    
    cleanup() {
        // Remove old posts if storage is getting full
        const posts = this.get('posts', []);
        if (posts.length > 50) {
            const recentPosts = posts.slice(0, 50);
            this.set('posts', recentPosts);
        }
    }
    
    migrate() {
        const currentVersion = this.get('version', '0.0.0');
        if (currentVersion !== this.version) {
            // Perform migration logic here
            this.set('version', this.version);
        }
    }
}

// Global storage instance
window.storage = new StorageManager();