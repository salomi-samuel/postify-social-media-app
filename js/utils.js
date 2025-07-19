// Utility functions

function formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }
        
        currentMediaFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const tagInput = document.getElementById('tagInput');
        const tag = tagInput.value.trim().toLowerCase();
        
        if (tag && !currentTags.includes(tag) && currentTags.length < 5) {
            currentTags.push(tag);
            updateTagsDisplay();
            tagInput.value = '';
        } else if (currentTags.length >= 5) {
            alert('Maximum 5 tags allowed');
        }
    }
}

function updateTagsDisplay() {
    const tagsDisplay = document.getElementById('tagsDisplay');
    tagsDisplay.innerHTML = '';
    
    currentTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            #${tag}
            <span class="remove-tag" onclick="removeTag('${tag}')">×</span>
        `;
        tagsDisplay.appendChild(tagElement);
    });
}

function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    updateTagsDisplay();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

function exportData() {
    const data = {
        user: currentUser,
        posts: posts
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'social-media-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}