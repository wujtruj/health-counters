// Health Counters Server
// Node.js Express server for serving static counter files

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Configuration from environment variables
const config = {
    port: process.env.PORT || 8011,
    personName: process.env.PERSON_NAME || 'John Doe',
    healthyStartDate: process.env.HEALTHY_START_DATE || '2024-01-01',
    doctorStartDate: process.env.DOCTOR_START_DATE || '2024-01-15',
    trustProxy: process.env.TRUST_PROXY === 'true' || false
};

// Trust proxy if behind reverse proxy (for X-Forwarded-* headers)
if (config.trustProxy) {
    app.set('trust proxy', true);
    console.log('✓ Trusting proxy headers (X-Forwarded-*)');
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        personName: config.personName,
        uptime: process.uptime()
    });
});

// Avatar auto-detection endpoint
app.get('/avatar', async (req, res) => {
    const avatarFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    
    try {
        for (const format of avatarFormats) {
            const avatarPath = path.join(__dirname, `avatar.${format}`);
            try {
                await fs.access(avatarPath);
                // File exists, serve it
                const mimeTypes = {
                    'png': 'image/png',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml'
                };
                
                res.setHeader('Content-Type', mimeTypes[format] || 'image/png');
                res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
                
                const fileData = await fs.readFile(avatarPath);
                return res.send(fileData);
            } catch (err) {
                // File doesn't exist, try next format
                continue;
            }
        }
        
        // No avatar file found, return 404
        res.status(404).send('Avatar not found');
    } catch (error) {
        console.error('Error serving avatar:', error);
        res.status(500).send('Error loading avatar');
    }
});

// Main route - serve processed HTML
app.get('/', async (req, res) => {
    try {
        // Read the HTML template
        let html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
        
        // Replace template variables with actual values
        const currentYear = new Date().getFullYear();
        const replacements = {
            '{{PERSON_NAME}}': config.personName,
            '{{HEALTHY_START_DATE}}': config.healthyStartDate,
            '{{DOCTOR_START_DATE}}': config.doctorStartDate,
            '{{CURRENT_YEAR}}': currentYear
        };
        
        // Apply all replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            html = html.replace(new RegExp(placeholder, 'g'), value);
        });
        
        // Log client information for debugging (when behind proxy)
        const clientIP = req.ip || req.connection.remoteAddress;
        const protocol = req.get('X-Forwarded-Proto') || req.protocol;
        console.log(`📊 Dashboard served to ${clientIP} via ${protocol}`);
        
        res.send(html);
    } catch (error) {
        console.error('Error serving dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Process and serve JavaScript with configuration
app.get('/script.js', async (req, res) => {
    try {
        let js = await fs.readFile(path.join(__dirname, 'script.js'), 'utf8');
        
        // Replace configuration placeholders
        const currentYear = new Date().getFullYear();
        const replacements = {
            "'{{PERSON_NAME}}'": `'${config.personName}'`,
            "'{{HEALTHY_START_DATE}}'": `'${config.healthyStartDate}'`,
            "'{{DOCTOR_START_DATE}}'": `'${config.doctorStartDate}'`,
            "'{{CURRENT_YEAR}}'": `'${currentYear}'`
        };
        
        Object.entries(replacements).forEach(([placeholder, value]) => {
            js = js.replace(new RegExp(placeholder, 'g'), value);
        });
        
        res.setHeader('Content-Type', 'application/javascript');
        res.send(js);
    } catch (error) {
        console.error('Error serving script:', error);
        res.status(500).send('console.error("Failed to load script");');
    }
});

// Middleware for parsing and serving static files (AFTER route handlers)
app.use(express.static('.', {
    // Cache static files for 1 hour
    maxAge: '1h',
    // Don't cache HTML files (they contain dynamic content)  
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Page Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #e74c3c; }
            </style>
        </head>
        <body>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Return to Dashboard</a>
        </body>
        </html>
    `);
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(config.port, '0.0.0.0', () => {
    console.log('🚀 Health Counters Server Started');
    console.log('=====================================');
    console.log(`📍 Server: http://localhost:${config.port}`);
    console.log(`👤 Person: ${config.personName}`);
    console.log(`🌟 Healthy since: ${config.healthyStartDate}`);
    console.log(`🩺 Doctor visit: ${config.doctorStartDate}`);
    console.log(` Trust Proxy: ${config.trustProxy}`);
    console.log('=====================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});