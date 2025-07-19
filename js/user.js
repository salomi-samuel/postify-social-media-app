// User management functions
let currentUser = null;

function createProfile() {
    const username = document.getElementById('username').value.trim();
    const bio = document.getElementById('bio').value.trim();
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    currentUser = {
        username: username,
        bio: bio,
        avatar: username.charAt(0).toUpperCase(),
        joinDate: new Date()
    };
    
    // Update UI
    document.getElementById('userSetup').classList.add('hidden');
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('postCreator').classList.remove('hidden');
    
    updateProfileDisplay();
    
    // Save to localStorage if available
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function updateProfileDisplay() {
    if (!currentUser) return;
    
    document.getElementById('profileAvatar').textContent = currentUser.avatar;
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileBio').textContent = currentUser.bio || 'No bio yet';
}

function editProfile() {
    document.getElementById('username').value = currentUser.username;
    document.getElementById('bio').value = currentUser.bio;
    document.getElementById('userSetup').classList.remove('hidden');
    document.getElementById('userProfile').classList.add('hidden');
}

function loadUserFromStorage() {
    if (typeof(Storage) !== "undefined") {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            document.getElementById('userSetup').classList.add('hidden');
            document.getElementById('userProfile').classList.remove('hidden');
            document.getElementById('postCreator').classList.remove('hidden');
            updateProfileDisplay();
        }
    }
}