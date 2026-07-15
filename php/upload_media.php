<?php
// Minimal media upload endpoint for admin panel.
// Resizes images and converts videos to match website display size.

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

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['file'];

// Limit file size (bytes): 100 MB
$maxBytes = 100 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'File too large']);
    exit;
}

$mime = mime_content_type($file['tmp_name']);

$allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$allowedVideos = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

if (in_array($mime, $allowedImages, true)) {
    $subdir = 'images';
} elseif (in_array($mime, $allowedVideos, true) || strpos($mime, 'video/') === 0) {
    $subdir = 'videos';
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unsupported file type']);
    exit;
}

$baseDir = realpath(__DIR__ . '/../');
$targetDir = $baseDir . '/' . $subdir;
if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to create upload directory']);
    exit;
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeExt = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($ext));
if ($safeExt === '') {
    $safeExt = $subdir === 'images' ? 'jpg' : 'mp4';
}

$filename = time() . '_' . bin2hex(random_bytes(6)) . '.' . $safeExt;
$targetPath = $targetDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to move uploaded file']);
    exit;
}

if ($subdir === 'images') {
    $maxWidth = 1920;
    $maxHeight = 1080;
    $imageInfo = getimagesize($targetPath);
    if ($imageInfo === false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid image file']);
        exit;
    }

    list($width, $height) = $imageInfo;
    if ($width > $maxWidth || $height > $maxHeight) {
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = max(1, (int) round($width * $ratio));
        $newHeight = max(1, (int) round($height * $ratio));

        $srcImage = null;
        switch ($imageInfo[2]) {
            case IMAGETYPE_JPEG:
                $srcImage = imagecreatefromjpeg($targetPath);
                break;
            case IMAGETYPE_PNG:
                $srcImage = imagecreatefrompng($targetPath);
                break;
            case IMAGETYPE_GIF:
                $srcImage = imagecreatefromgif($targetPath);
                break;
            case IMAGETYPE_WEBP:
                if (function_exists('imagecreatefromwebp')) {
                    $srcImage = imagecreatefromwebp($targetPath);
                }
                break;
        }

        if ($srcImage) {
            $dstImage = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($dstImage, false);
            imagesavealpha($dstImage, true);
            imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            switch ($imageInfo[2]) {
                case IMAGETYPE_PNG:
                    imagepng($dstImage, $targetPath, 6);
                    break;
                case IMAGETYPE_GIF:
                    imagegif($dstImage, $targetPath);
                    break;
                case IMAGETYPE_WEBP:
                    if (function_exists('imagewebp')) {
                        imagewebp($dstImage, $targetPath, 85);
                        break;
                    }
                case IMAGETYPE_JPEG:
                default:
                    imagejpeg($dstImage, $targetPath, 85);
                    break;
            }

            imagedestroy($srcImage);
            imagedestroy($dstImage);
        }
    }
} else {
    $ffmpeg = null;
    $check = trim(shell_exec('ffmpeg -version 2>&1'));
    if ($check !== '') {
        $ffmpeg = 'ffmpeg';
    } elseif (is_executable('/usr/bin/ffmpeg')) {
        $ffmpeg = '/usr/bin/ffmpeg';
    }

    if ($ffmpeg) {
        $resultPath = $targetDir . '/resized_' . $filename;
        $maxWidth = 1920;
        $maxHeight = 1080;
        $aspectExpr = ($maxWidth / $maxHeight);

        $cmd = escapeshellcmd($ffmpeg) .
            ' -y -i ' . escapeshellarg($targetPath) .
            ' -vf "scale=if(gt(a,' . $aspectExpr . '),' . $maxWidth . ':-2):if(gt(a,' . $aspectExpr . '),-2,' . $maxHeight . ')"' .
            ' -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ' . escapeshellarg($resultPath) .
            ' 2>&1';

        $output = [];
        $returnVar = 0;
        exec($cmd, $output, $returnVar);
        if ($returnVar === 0 && file_exists($resultPath)) {
            unlink($targetPath);
            rename($resultPath, $targetPath);
        } else {
            if (file_exists($resultPath)) {
                unlink($resultPath);
            }
        }
    }
}

$publicUrl = $subdir . '/' . $filename;
echo json_encode(['ok' => true, 'url' => $publicUrl]);
?>
