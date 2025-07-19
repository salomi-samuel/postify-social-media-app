// Post management functions
let posts = [];
let postIdCounter = 1;
let currentTags = [];
let currentMediaFile = null;

async function createPost() {
    const content = document.getElementById('postContent').value.trim();

    if (!content && !currentMediaFile) {
        alert('Please add some content or media');
        return;
    }

    let base64Media = null;
    if (currentMediaFile) {
        base64Media = await readFileAsBase64(currentMediaFile);
    }

    const post = {
        id: postIdCounter++,
        author: currentUser.username,
        avatar: currentUser.avatar,
        content: content,
        tags: [...currentTags],
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
        comments: [],
        media: base64Media ? {
            type: currentMediaFile.type.startsWith('image') ? 'image' : 'video',
            url: base64Media
        } : null
    };

    posts.unshift(post);
    renderPosts();

    // Reset form
    resetPostForm();

    // Save to localStorage
    savePostsToStorage();
}
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        posts = posts.filter(post => post.id !== postId);
        renderPosts();
        savePostsToStorage();
    }
}


function resetPostForm() {
    document.getElementById('postContent').value = '';
    document.getElementById('tagInput').value = '';
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
    currentTags = [];
    currentMediaFile = null;
    updateTagsDisplay();
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = generatePostHTML(post);
        container.appendChild(postElement);
    });
}

function generatePostHTML(post) {
    // Fixed hashtag display logic
    const tagsHTML = post.tags && post.tags.length > 0 ? 
        `<div class="post-tags">
            ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
        </div>` : '';
    
    return `
        <div class="post-header">
            <div class="avatar">${post.avatar}</div>
            <div class="post-info">
                <h4>${post.author}</h4>
                <div class="post-time">${formatTime(post.timestamp)}</div>
            </div>
        </div>
        
        <div class="post-content">
            <p>${post.content}</p>
        </div>
        
        ${post.media ? `
            <div class="post-media">
                ${post.media.type === 'image' ? 
                    `<img src="${post.media.url}" alt="Post media">` :
                    `<video controls src="${post.media.url}"></video>`
                }
            </div>
        ` : ''}
        
        ${tagsHTML}
        
        <div class="post-actions">
            <button class="action-btn ${post.likedBy.includes(currentUser.username) ? 'liked' : ''}" 
                    onclick="toggleLike(${post.id})">
                ❤️ ${post.likes} ${post.likes === 1 ? 'Like' : 'Likes'}
            </button>
            <button class="action-btn" onclick="toggleComments(${post.id})">
                💬 ${post.comments.length} Comments
            </button>
            <button class="action-btn delete-btn" onclick="deletePost(${post.id})">
    🗑️ Delete
</button>

        </div>
        
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
            <div class="comments-list">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <div class="comment-author">${comment.author}</div>
                        <div>${comment.content}</div>
                    </div>
                `).join('')}
            </div>
            <div class="comment-input">
                <input type="text" placeholder="Write a comment..." 
                       onkeypress="handleCommentInput(event, ${post.id})">
                <button class="btn" onclick="addComment(${post.id})">Post</button>
            </div>
        </div>
    `;
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post.likedBy.includes(currentUser.username)) {
        post.likedBy = post.likedBy.filter(user => user !== currentUser.username);
        post.likes--;
    } else {
        post.likedBy.push(currentUser.username);
        post.likes++;
    }
    renderPosts();
    savePostsToStorage();
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

function handleCommentInput(event, postId) {
    if (event.key === 'Enter') {
        addComment(postId);
    }
}

function addComment(postId) {
    const input = document.querySelector(`#comments-${postId} input`);
    const content = input.value.trim();
    
    if (!content) return;
    
    const post = posts.find(p => p.id === postId);
    post.comments.push({
        author: currentUser.username,
        content: content,
        timestamp: new Date()
    });
    
    input.value = '';
    renderPosts();
    document.getElementById(`comments-${postId}`).style.display = 'block';
    savePostsToStorage();
}

function savePostsToStorage() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('postIdCounter', postIdCounter);
    }
}

function loadPostsFromStorage() {
    if (typeof(Storage) !== "undefined") {
        const savedPosts = localStorage.getItem('posts');
        const savedCounter = localStorage.getItem('postIdCounter');
        
        if (savedPosts) {
            posts = JSON.parse(savedPosts);
            // Convert timestamp strings back to Date objects
            posts.forEach(post => {
                post.timestamp = new Date(post.timestamp);
                post.comments.forEach(comment => {
                    comment.timestamp = new Date(comment.timestamp);
                });
            });
        }
        
        if (savedCounter) {
            postIdCounter = parseInt(savedCounter);
        }
    }
}

function initializeSamplePosts() {
    if (posts.length === 0) {
        posts = [
            {
                id: 1,
                author: 'Alice',
                avatar: 'A',
                content: 'Beautiful sunset at the beach today! 🌅',
                tags: ['sunset', 'beach', 'nature'],
                timestamp: new Date(Date.now() - 3600000),
                likes: 12,
                likedBy: ['Bob', 'Charlie'],
                comments: [
                    { author: 'Bob', content: 'Stunning view!', timestamp: new Date() },
                    { author: 'Charlie', content: 'I love sunsets!', timestamp: new Date() }
                ],
                media: null
            },
            {
                id: 2,
                author: 'Bob',
                avatar: 'B',
                content: 'Just finished my morning workout! Feeling energized 💪',
                tags: ['fitness', 'workout', 'health'],
                timestamp: new Date(Date.now() - 7200000),
                likes: 8,
                likedBy: ['Alice'],
                comments: [
                    { author: 'Alice', content: 'Great job! Keep it up!', timestamp: new Date() }
                ],
                media: null
            }
        ];
        
        postIdCounter = 3;
    }
}