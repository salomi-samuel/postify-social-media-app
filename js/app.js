// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data
    loadUserFromStorage();
    loadPostsFromStorage();
    
    // Initialize sample posts if no posts exist
    initializeSamplePosts();
    
    // Render posts
    renderPosts();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl + Enter to create post
        if (event.ctrlKey && event.key === 'Enter') {
            const postContent = document.getElementById('postContent');
            if (document.activeElement === postContent) {
                createPost();
            }
        }
        
        // Escape to close comments
        if (event.key === 'Escape') {
            const openComments = document.querySelectorAll('.comments-section[style*="block"]');
            openComments.forEach(section => {
                section.style.display = 'none';
            });
        }
    });
    
    // Add auto-save functionality
    setInterval(function() {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        if (posts.length > 0) {
            savePostsToStorage();
        }
    }, 30000); // Auto-save every 30 seconds
}

// Add some developer tools
window.socialMediaApp = {
    clearData: clearAllData,
    exportData: exportData,
    getCurrentUser: () => currentUser,
    getPosts: () => posts,
    version: '1.0.0'
};

console.log('🌟 SocialConnect App Loaded! 🌟');
console.log('Developer tools available at: window.socialMediaApp');