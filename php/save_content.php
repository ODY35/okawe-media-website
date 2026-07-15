<?php
// Minimal endpoint to save JSON content from the admin panel.
// Improved validation and safer write for local/testing.

header('Content-Type: application/json');

$PASSWORD = 'mado260805A';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$pass = isset($_POST['password']) ? $_POST['password'] : '';
if ($pass !== $PASSWORD) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden: invalid password']);
    exit;
}

$lang = isset($_POST['lang']) ? preg_replace('/[^a-zA-Z_-]/', '', $_POST['lang']) : 'en';
$section = isset($_POST['section']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['section']) : '';
$payload = isset($_POST['payload']) ? $_POST['payload'] : null;

if (!$section || $payload === null) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Bad request: missing parameters']);
    exit;
}

// Validate JSON
$decoded = json_decode($payload, true);
if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

$baseDir = realpath(__DIR__ . '/../');
$dataDir = $baseDir . '/data/' . $lang;
if (!is_dir($dataDir)) {
    if (!mkdir($dataDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to create data directory']);
        exit;
    }
}

$filePath = $dataDir . '/' . $section . '.json';

// Write pretty-printed JSON atomically
$pretty = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($pretty === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to re-encode JSON']);
    exit;
}

$tmp = tempnam(sys_get_temp_dir(), 'okawe');
if (file_put_contents($tmp, $pretty) === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to write temporary file']);
    exit;
}

if (!rename($tmp, $filePath)) {
    if (!copy($tmp, $filePath)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to save file']);
        @unlink($tmp);
        exit;
    }
    @unlink($tmp);
}

echo json_encode(['ok' => true]);

?>
