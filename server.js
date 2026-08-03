/**
 * Simple local development server for OKAWE Media website.
 * Serves static files and handles PHP endpoint requests (sendMail, save_content, upload_media).
 * Run with: node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 8000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.txt': 'text/plain',
};

function getMimeType(filePath) {
    const ext = path.parse(filePath).ext.toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname === '/') pathname = '/index.html';

    // Prevent directory traversal
    const filePath = path.join(ROOT, pathname);
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(data);
    });
}

function handleSendMail(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        const params = querystring.parse(body);
        console.log('[sendMail] Form submission received:');
        console.log('  Name:', params.name);
        console.log('  Email:', params.email);
        console.log('  Subject:', params.subject);
        console.log('  Message:', params.message);
        console.log('  Action:', params.action);

        // Simulate successful email send (PHP mail() not available locally)
        const response = { ResponseData: 'Message Sent' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    });
}

function handleSaveContent(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        const params = querystring.parse(body);
        console.log('[saveContent] Save request received:');
        console.log('  Lang:', params.lang);
        console.log('  Section:', params.section);

        // Save to a local JSON file for testing
        const dataDir = path.join(ROOT, 'data', params.lang || 'en');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, (params.section || 'unknown') + '.json');
        try {
            const payload = JSON.parse(params.payload || '{}');
            fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
            console.log('  Saved to:', filePath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
        } catch (e) {
            console.error('  Error saving:', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: e.message }));
        }
    });
}

function handleUploadMedia(req, res) {
    // Simple response for testing - actual file upload handling would need multipart parsing
    console.log('[uploadMedia] Upload request received (not fully implemented in local server)');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, url: 'demo-images/logo.png' }));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    // Log all requests
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${pathname}`);

    // Route PHP endpoints
    if (pathname === '/php/sendMail.php' && req.method === 'POST') {
        return handleSendMail(req, res);
    }
    if (pathname === '/php/save_content.php' && req.method === 'POST') {
        return handleSaveContent(req, res);
    }
    if (pathname === '/php/upload_media.php' && req.method === 'POST') {
        return handleUploadMedia(req, res);
    }

    // Serve static files for everything else
    serveStatic(req, res);
});

server.listen(PORT, () => {
    console.log(`\n✅ OKAWE Media local server running at http://localhost:${PORT}`);
    console.log(`   Serving static files from: ${ROOT}`);
    console.log(`   PHP endpoints simulated: sendMail.php, save_content.php, upload_media.php\n`);
});
