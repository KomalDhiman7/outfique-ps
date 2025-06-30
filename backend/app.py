from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import uuid
import os
from datetime import datetime, timedelta
import requests
import json

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

CORS(app)
jwt = JWTManager(app)

@app.route('/')
def home():
    return jsonify({"message": "Outfique backend is live 🚀"}), 200

@app.route('/api/wardrobe/upload', methods=['POST'])
@jwt_required()
def upload_wardrobe_image():
    if 'image' not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400

    image = request.files['image']
    caption = request.form.get('caption', '')
    user_id = get_jwt_identity()

    if image.filename == '':
        return jsonify({'message': 'No filename provided'}), 400

    filename = secure_filename(image.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(save_path)

    conn = get_db()
    cursor = conn.cursor()

    clothing_id = str(uuid.uuid4())
    image_url = f"/{save_path}"  # you can update this to a proper URL later

    cursor.execute('''
        INSERT INTO clothing_items (id, user_id, name, category, image_url, tags)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (clothing_id, user_id, caption, 'unspecified', image_url, json.dumps([])))

    conn.commit()
    conn.close()

    return jsonify({
        'message': 'Wardrobe item uploaded!',
        'item': {
            'id': clothing_id,
            'name': caption,
            'imageUrl': image_url
        }
    }), 201

# Database initialization
def init_db():
    conn = sqlite3.connect('outfique.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT NOT NULL,
            bio TEXT,
            avatar TEXT,
            is_premium BOOLEAN DEFAULT FALSE,
            theme TEXT DEFAULT 'light',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            image_url TEXT NOT NULL,
            caption TEXT,
            tags TEXT,
            likes INTEGER DEFAULT 0,
            saves INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Comments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            post_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Clothing items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clothing_items (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            color TEXT,
            image_url TEXT NOT NULL,
            tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Likes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS likes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            post_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    ''')
    
    # Saves table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saves (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            post_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    ''')
    
    # Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            from_user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            post_id TEXT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (from_user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Helper functions
def get_db():
    conn = sqlite3.connect('outfique.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_notification(user_id, from_user_id, notification_type, message, post_id=None):
    conn = get_db()
    cursor = conn.cursor()
    
    notification_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO notifications (id, user_id, from_user_id, type, post_id, message)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (notification_id, user_id, from_user_id, notification_type, post_id, message))
    
    conn.commit()
    conn.close()

# Mock data for development
def seed_data():
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if we already have users
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] > 0:
        conn.close()
        return
    
    # Create sample users
    sample_users = [
        {
            'id': str(uuid.uuid4()),
            'username': 'fashionista',
            'email': 'fashionista@example.com',
            'display_name': 'Fashion Lover',
            'bio': 'Style is my passion 💫',
            'password_hash': generate_password_hash('password123')
        },
        {
            'id': str(uuid.uuid4()),
            'username': 'styleblogger',
            'email': 'styleblogger@example.com',
            'display_name': 'Style Blogger',
            'bio': 'Sharing my daily outfits',
            'password_hash': generate_password_hash('password123')
        }
    ]
    
    for user in sample_users:
        cursor.execute('''
            INSERT INTO users (id, username, email, display_name, bio, password_hash)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user['id'], user['username'], user['email'], user['display_name'], user['bio'], user['password_hash']))
    
    # Create sample posts
    sample_posts = [
        {
            'id': str(uuid.uuid4()),
            'user_id': sample_users[0]['id'],
            'image_url': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
            'caption': 'Perfect casual Friday outfit! 🌟',
            'tags': json.dumps(['casual', 'friday', 'comfortable'])
        },
        {
            'id': str(uuid.uuid4()),
            'user_id': sample_users[1]['id'],
            'image_url': 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg',
            'caption': 'Elegant evening look for dinner 🌙',
            'tags': json.dumps(['elegant', 'evening', 'dinner'])
        }
    ]
    
    for post in sample_posts:
        cursor.execute('''
            INSERT INTO posts (id, user_id, image_url, caption, tags)
            VALUES (?, ?, ?, ?, ?)
        ''', (post['id'], post['user_id'], post['image_url'], post['caption'], post['tags']))
    
    conn.commit()
    conn.close()

# Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
    if cursor.fetchone():
        conn.close()
        return jsonify({'message': 'User already exists'}), 409
    
    # Create user
    user_id = str(uuid.uuid4())
    password_hash = generate_password_hash(password)
    
    cursor.execute('''
        INSERT INTO users (id, username, email, display_name, password_hash)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, username, email, username, password_hash))
    
    conn.commit()
    
    # Get user data
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = dict(cursor.fetchone())
    
    conn.close()
    
    # Create access token
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'displayName': user['display_name'],
            'bio': user['bio'],
            'avatar': user['avatar'],
            'isPremium': bool(user['is_premium']),
            'theme': user['theme'],
            'createdAt': user['created_at']
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if not user or not check_password_hash(user['password_hash'], password):
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401
    
    conn.close()
    
    # Create access token
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'displayName': user['display_name'],
            'bio': user['bio'],
            'avatar': user['avatar'],
            'isPremium': bool(user['is_premium']),
            'theme': user['theme'],
            'createdAt': user['created_at']
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    conn.close()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'displayName': user['display_name'],
        'bio': user['bio'],
        'avatar': user['avatar'],
        'isPremium': bool(user['is_premium']),
        'theme': user['theme'],
        'createdAt': user['created_at']
    })

@app.route('/api/posts', methods=['GET'])
@jwt_required()
def get_posts():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.*, u.username, u.display_name, u.avatar,
               (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as like_count,
               (SELECT COUNT(*) FROM saves s WHERE s.post_id = p.id) as save_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    ''')
    
    posts = []
    for row in cursor.fetchall():
        post = dict(row)
        
        # Get comments
        cursor.execute('''
            SELECT c.*, u.username, u.display_name, u.avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        ''', (post['id'],))
        
        comments = []
        for comment_row in cursor.fetchall():
            comment = dict(comment_row)
            comments.append({
                'id': comment['id'],
                'content': comment['content'],
                'createdAt': comment['created_at'],
                'user': {
                    'id': comment['user_id'],
                    'username': comment['username'],
                    'displayName': comment['display_name'],
                    'avatar': comment['avatar']
                }
            })
        
        posts.append({
            'id': post['id'],
            'imageUrl': post['image_url'],
            'caption': post['caption'],
            'tags': json.loads(post['tags']) if post['tags'] else [],
            'likes': post['like_count'],
            'saves': post['save_count'],
            'comments': comments,
            'isLiked': False,  # TODO: Check if current user liked
            'isSaved': False,  # TODO: Check if current user saved
            'createdAt': post['created_at'],
            'user': {
                'id': post['user_id'],
                'username': post['username'],
                'displayName': post['display_name'],
                'avatar': post['avatar']
            }
        })
    
    conn.close()
    return jsonify(posts)

@app.route('/api/posts/explore', methods=['GET'])
@jwt_required()
def get_explore_posts():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.*, u.username, u.display_name, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY RANDOM()
        LIMIT 20
    ''')
    
    posts = []
    for row in cursor.fetchall():
        post = dict(row)
        posts.append({
            'id': post['id'],
            'imageUrl': post['image_url'],
            'caption': post['caption'],
            'tags': json.loads(post['tags']) if post['tags'] else [],
            'createdAt': post['created_at'],
            'user': {
                'id': post['user_id'],
                'username': post['username'],
                'displayName': post['display_name'],
                'avatar': post['avatar']
            }
        })
    
    conn.close()
    return jsonify(posts)

@app.route('/api/search', methods=['GET'])
@jwt_required()
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'users': [], 'posts': []})
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Search users
    cursor.execute('''
        SELECT id, username, display_name, bio, avatar
        FROM users
        WHERE username LIKE ? OR display_name LIKE ?
        LIMIT 10
    ''', (f'%{query}%', f'%{query}%'))
    
    users = []
    for row in cursor.fetchall():
        user = dict(row)
        users.append({
            'id': user['id'],
            'username': user['username'],
            'displayName': user['display_name'],
            'bio': user['bio'],
            'avatar': user['avatar'],
            'isPremium': False
        })
    
    # Search posts
    cursor.execute('''
        SELECT p.*, u.username, u.display_name, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.caption LIKE ? OR p.tags LIKE ?
        LIMIT 20
    ''', (f'%{query}%', f'%{query}%'))
    
    posts = []
    for row in cursor.fetchall():
        post = dict(row)
        posts.append({
            'id': post['id'],
            'imageUrl': post['image_url'],
            'caption': post['caption'],
            'tags': json.loads(post['tags']) if post['tags'] else [],
            'createdAt': post['created_at'],
            'user': {
                'id': post['user_id'],
                'username': post['username'],
                'displayName': post['display_name'],
                'avatar': post['avatar']
            }
        })
    
    conn.close()
    return jsonify({'users': users, 'posts': posts})

@app.route('/api/suggestions/wardrobe', methods=['GET'])
@jwt_required()
def get_wardrobe_suggestions():
    # Mock outfit suggestions based on wardrobe
    suggestions = [
        {
            'id': str(uuid.uuid4()),
            'occasion': 'Casual Day Out',
            'confidence': 0.92,
            'items': [
                {
                    'id': str(uuid.uuid4()),
                    'name': 'Blue Denim Jacket',
                    'category': 'outerwear',
                    'color': 'blue',
                    'imageUrl': 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg'
                },
                {
                    'id': str(uuid.uuid4()),
                    'name': 'White T-Shirt',
                    'category': 'top',
                    'color': 'white',
                    'imageUrl': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'
                }
            ],
            'buyLinks': [
                {
                    'name': 'Similar Jacket',
                    'url': '#',
                    'price': '$59.99',
                    'imageUrl': 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg'
                }
            ]
        }
    ]
    
    return jsonify(suggestions)

@app.route('/api/suggestions/weather', methods=['GET'])
@jwt_required()
def get_weather_suggestions():
    # Mock weather data and suggestions
    weather_data = {
        'location': 'New York, NY',
        'temperature': 22,
        'condition': 'Partly Cloudy',
        'humidity': 60,
        'windSpeed': 10
    }
    
    suggestions = [
        {
            'id': str(uuid.uuid4()),
            'occasion': 'Perfect for Today\'s Weather',
            'confidence': 0.88,
            'weather': 'Partly Cloudy, 22°C',
            'items': [
                {
                    'id': str(uuid.uuid4()),
                    'name': 'Light Cardigan',
                    'category': 'outerwear',
                    'color': 'beige',
                    'imageUrl': 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg'
                },
                {
                    'id': str(uuid.uuid4()),
                    'name': 'Cotton Dress',
                    'category': 'dress',
                    'color': 'floral',
                    'imageUrl': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'
                }
            ],
            'buyLinks': []
        }
    ]
    
    return jsonify({
        'weather': weather_data,
        'suggestions': suggestions
    })

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT n.*, u.username, u.display_name, u.avatar
        FROM notifications n
        JOIN users u ON n.from_user_id = u.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
    ''', (user_id,))
    
    notifications = []
    for row in cursor.fetchall():
        notification = dict(row)
        notifications.append({
            'id': notification['id'],
            'type': notification['type'],
            'message': notification['message'],
            'isRead': bool(notification['is_read']),
            'createdAt': notification['created_at'],
            'postId': notification['post_id'],
            'fromUser': {
                'id': notification['from_user_id'],
                'username': notification['username'],
                'displayName': notification['display_name'],
                'avatar': notification['avatar']
            }
        })
    
    conn.close()
    return jsonify(notifications)

@app.route('/api/users/<user_id>/posts', methods=['GET'])
@jwt_required()
def get_user_posts(user_id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM posts
        WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,))
    
    posts = []
    for row in cursor.fetchall():
        post = dict(row)
        posts.append({
            'id': post['id'],
            'imageUrl': post['image_url'],
            'caption': post['caption'],
            'tags': json.loads(post['tags']) if post['tags'] else [],
            'createdAt': post['created_at']
        })
    
    conn.close()
    return jsonify(posts)

@app.route('/api/users/<user_id>/saved', methods=['GET'])
@jwt_required()
def get_user_saved_posts(user_id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.* FROM posts p
        JOIN saves s ON p.id = s.post_id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC
    ''', (user_id,))
    
    posts = []
    for row in cursor.fetchall():
        post = dict(row)
        posts.append({
            'id': post['id'],
            'imageUrl': post['image_url'],
            'caption': post['caption'],
            'tags': json.loads(post['tags']) if post['tags'] else [],
            'createdAt': post['created_at']
        })
    
    conn.close()
    return jsonify(posts)

@app.route('/api/users/<user_id>/wardrobe', methods=['GET'])
@jwt_required()
def get_user_wardrobe(user_id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM clothing_items
        WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,))
    
    items = []
    for row in cursor.fetchall():
        item = dict(row)
        items.append({
            'id': item['id'],
            'name': item['name'],
            'category': item['category'],
            'color': item['color'],
            'imageUrl': item['image_url'],
            'tags': json.loads(item['tags']) if item['tags'] else [],
            'createdAt': item['created_at']
        })
    
    conn.close()
    return jsonify(items)

if __name__ == '__main__':
    init_db()
    seed_data()
    app.run(debug=True, port=5000)