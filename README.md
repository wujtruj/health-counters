# Health Counters 🏥

A responsive web application that tracks daily counters for health-related milestones. Features bilingual support (English/Spanish), configurable counters, and Docker deployment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## ✨ Features

- **📊 Day Counters**: Track "Days Since Healthy" and "Days Since Doctor Visit"
- **🌐 Bilingual Support**: English/Polish with automatic browser language detection
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🖼️ Avatar Support**: Auto-detects multiple image formats (PNG, JPG, GIF, WebP, SVG)
- **🐳 Docker Ready**: Easy deployment with Docker and Docker Compose
- **⚡ Performance Optimized**: Client-side calculations with smart caching
- **🔒 Security**: Runs as non-root user in container
- **🔄 Real-time Updates**: Counters update every minute and at midnight

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- OR Node.js 16+ (for local development)

### Option 1: Docker Compose (Recommended)

1. **Build the image first**:
```bash
docker build -t health-counters:local .
```

2. **Configure your settings** in `docker-compose.yml`:
```yaml
environment:
  - PERSON_NAME=Your Name
  - HEALTHY_START_DATE=2024-01-01
  - DOCTOR_START_DATE=2024-01-15
  - TRUST_PROXY=true  # If behind reverse proxy
```

3. **Run the application**:
```bash
docker-compose up
```

4. **Access**: Open http://localhost:8011
#### Server Deployment

For deployment on a remote server:

```bash
# 1. Upload project files to your server
scp -r ./health-counters user@your-server:/path/to/deployment/

# 2. SSH into your server
ssh user@your-server

# 3. Navigate to project directory
cd /path/to/deployment/health-counters

# 4. Build the image
docker build -t health-counters:local .

# 5. Configure environment in docker-compose.yml
# Edit the environment variables as needed

# 6. Run the application
docker-compose up -d
```
### Option 2: Portainer (Docker UI)

**Prerequisites**: Build the image first on your server:
```bash
docker build -t health-counters:local .
```

1. **Access Portainer**: Open your Portainer web interface

2. **Create Stack**:
   - Go to "Stacks" → "Add stack"
   - Name: `health-counters`
   - Web editor: Copy the contents of `docker-compose.yml`

3. **Configure Environment**:
   - Scroll to "Environment variables" section
   - Add your custom values:
     ```
     PERSON_NAME=Your Name
     HEALTHY_START_DATE=2024-01-01
     DOCTOR_START_DATE=2024-01-15
     TRUST_PROXY=true
     ```

4. **Deploy**: Click "Deploy the stack"

5. **Access**: Open http://localhost:8011 (or your server IP:8011)

### Option 3: Direct Docker

```bash
# Build the image
docker build -t health-counters .

# Run with custom configuration
docker run -p 8011:8011 \
  -e PERSON_NAME="Your Name" \
  -e HEALTHY_START_DATE="2024-01-01" \
  -e DOCTOR_START_DATE="2024-01-15" \
  -e TRUST_PROXY=true \
  health-counters
```

### Option 4: Local Development

```bash
# Install dependencies
npm install

# Set environment variables (optional)
export PERSON_NAME="Your Name"
export HEALTHY_START_DATE="2024-01-01"
export DOCTOR_START_DATE="2024-01-15"

# Start development server
npm run dev
# or production
npm start
```

## ⚙️ Configuration

Configure the application using environment variables:

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PERSON_NAME` | Display name for the counters | `John Doe` | `Maria García` |
| `HEALTHY_START_DATE` | When the person became healthy | `2024-01-01` | `2024-03-15` |
| `DOCTOR_START_DATE` | Last doctor visit date | `2024-01-15` | `2024-02-28` |
| `PORT` | Server port | `8011` | `3000` |
| `TRUST_PROXY` | Trust X-Forwarded headers | `false` | `true` |

### Date Format
All dates must be in **YYYY-MM-DD** format (ISO 8601).

## 🖼️ Avatar Setup

The application automatically detects avatar images in the project root:

### Supported Formats
- `avatar.png` ← Recommended
- `avatar.jpg` / `avatar.jpeg`
- `avatar.gif` ← For animated avatars
- `avatar.webp` ← Modern format
- `avatar.svg` ← Vector graphics

### Adding Your Avatar

1. **Replace the placeholder**:
```bash
# Copy your image to the project root
cp /path/to/your/image.png ./avatar.png
```

2. **Privacy**: Avatar images are automatically excluded from Git (see `.gitignore`)

3. **Docker**: Mount your avatar at runtime:
```yaml
volumes:
  - ./my-avatar.png:/app/avatar.png:ro
```

## 🌐 Language Support

### Available Languages
- **English** (en) - Default for most browsers
- **Polish** (pl) - Auto-detected for Polish browsers

### Features
- 🔄 Toggle button with flag indicators
- 🌍 Automatic browser language detection
- 📝 Complete UI translation
- 🎯 Persistent language selection

## 📁 Project Structure

```
health-counters/
├── index.html          # Main HTML template
├── styles.css          # Modern CSS with responsive design
├── script.js           # Client-side JavaScript
├── server.js           # Node.js Express server
├── package.json        # Dependencies and scripts
├── Dockerfile          # Multi-stage production build
├── docker-compose.yml  # Easy deployment configuration
├── avatar.svg          # Placeholder avatar (replaceable)
└── .gitignore         # Excludes avatars and node_modules
```

## 🔧 Development

### Scripts

```bash
npm start     # Production server
npm run dev   # Development with auto-restart
npm test      # Run tests (placeholder)
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Main counters page |
| `GET /health` | Health check (JSON) |
| `GET /avatar` | Auto-detected avatar image |
| `GET /script.js` | Processed JavaScript with config |

### Health Check

The `/health` endpoint provides server status:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-14T10:30:00.000Z",
  "personName": "John Doe",
  "uptime": 3600.5
}
```

## 🐳 Docker Details

### Multi-stage Build
- **Builder stage**: Installs dependencies
- **Production stage**: Minimal Alpine image
- **Security**: Non-root user (`dashboard:1001`)
- **Health checks**: Built-in container monitoring

### Behind Reverse Proxy

Set `TRUST_PROXY=true` to properly handle:
- Client IP detection
- Protocol forwarding (HTTP/HTTPS)
- Original host headers

Example with Traefik/Nginx:
```yaml
environment:
  - TRUST_PROXY=true
```

## 🎨 Customization

### Styling
- Modern glass-morphism design
- CSS custom properties for easy theming
- Responsive breakpoints for all devices
- Smooth animations and transitions

### Counter Logic
- Updates every minute automatically
- Midnight refresh for daily accuracy
- Client-side calculations for performance
- Handles timezone changes gracefully

## 🔒 Security Features

- 🛡️ Non-root container execution
- 🔐 Input sanitization and validation
- 📦 Minimal production image
- 🚫 No sensitive data in logs
- 🔄 Graceful shutdown handling

## 📊 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker-compose up --build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/wujtruj/health-counters
- **Issues**: https://github.com/wujtruj/health-counters/issues
- **Docker Hub**: (Coming soon)

---

## 🎯 Example Usage

Perfect for tracking:
- 🏃‍♂️ Fitness streaks and health milestones
- 💊 Medication compliance
- 🩺 Medical appointments and checkups
- 🧘‍♀️ Wellness routines and habits

Built with ❤️ using Node.js, Express, and vanilla JavaScript.