<?php
/**
 * ==========================================================
 * CONTACT FORM HANDLER
 * ==========================================================
 */

/* ----------------------- CONFIGURATION ----------------------- */

const RECIPIENT_EMAIL = 'saliaabiodun24@gmail.com';

const MESSAGE_LOG_DIR = __DIR__ . '/messages';


/* ------------------------- HELPERS --------------------------- */

function respond(bool $success, string $message): void
{
    $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
        && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest';

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => $success, 'message' => $message]);
    } else {
        $status = $success ? 'success' : 'error';
        header('Location: index.html?status=' . $status . '&msg=' . urlencode($message) . '#contact');
    }
    exit;
}

function flatten(string $value): string
{
    return str_replace(["\r", "\n", "%0a", "%0d"], '', $value);
}

/** Escapes user text so it is safe to store/display later. */
function cleanText(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}


function saveMessage(string $name, string $email, string $subject, string $message): bool
{
    if (!is_dir(MESSAGE_LOG_DIR)) {
        mkdir(MESSAGE_LOG_DIR, 0755, true);
    }

    $entry =
        "=========================================\n" .
        'Date:    ' . date('Y-m-d H:i:s') . "\n" .
        'Name:    ' . $name . "\n" .
        'Email:   ' . $email . "\n" .
        'Subject: ' . $subject . "\n" .
        'Message: ' . $message . "\n\n";

    return (bool) file_put_contents(
        MESSAGE_LOG_DIR . '/contact-log.txt',
        $entry,
        FILE_APPEND | LOCK_EX
    );
}


/* --------------------- FORM PROCESSING ----------------------- */

// Only accept POST requests (block direct visits to this file)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

$name    = flatten($_POST['name']    ?? '');
$email   = flatten($_POST['email']   ?? '');
$subject = flatten($_POST['subject'] ?? '');
$message = $_POST['message']         ?? '';

$name    = trim($name);
$email   = trim($email);
$subject = trim($subject);
$message = trim($message);

$errors = [];

if (strlen($name) < 2 || strlen($name) > 80) {
    $errors[] = 'Please enter your full name.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (strlen($subject) < 3 || strlen($subject) > 120) {
    $errors[] = 'Subject must be between 3 and 120 characters.';
}

if (strlen($message) < 10 || strlen($message) > 1500) {
    $errors[] = 'Message must be between 10 and 1500 characters.';
}

if ($errors) {
    respond(false, implode(' ', $errors));
}


$name    = cleanText($name);
$email   = cleanText($email);
$subject = cleanText($subject);
$message = cleanText($message);


if (RECIPIENT_EMAIL === 'saliaabiodun24@gmail.com') {
    if (saveMessage($name, $email, $subject, $message)) {
        respond(
            true,
            'Thank you, ' . $name . '! Your message has been received and saved. '
            . '(Demo mode: email delivery is not configured yet on this server.)'
        );
    }
    respond(false, 'Sorry, your message could not be saved. Please try again later.');
}

$headers  = 'From: Portfolio Contact Form <no-reply@localhost>' . "\r\n" .
            'Reply-To: ' . $email . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

$sent = @mail(RECIPIENT_EMAIL, '[Portfolio] ' . $subject, $message, $headers);

if ($sent) {
    respond(true, 'Thank you, ' . $name . '! Your message has been sent successfully.');
}

// Sending failed - keep the message safe and be honest about it.
saveMessage($name, $email, $subject, $message);
respond(
    false,
    'The email could not be sent right now, but your message has been saved. '
    . 'You can also reach me directly at ' . RECIPIENT_EMAIL . '.'
);
