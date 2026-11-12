<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

const TO   = 'doprava@adrysavy.cz';
const FROM = 'web@adrysavy.cz';

// Reply language: sent by contact-form.js, whitelisted so nothing else gets through
$lang = (($_POST['lang'] ?? 'cs') === 'en') ? 'en' : 'cs';

const MESSAGES = [
    'cs' => [
        'bad_request' => 'Neplatný požadavek.',
        'honeypot'    => 'Zpráva odeslána.',
        'invalid'     => 'Vyplňte prosím jméno, platný e-mail a zprávu.',
        'too_long'    => 'Zpráva je příliš dlouhá.',
        'ok'          => 'Děkujeme, zpráva byla odeslána.',
        'fail'        => 'Odeslání se nezdařilo, zkuste to prosím později nebo nám zavolejte.',
    ],
    'en' => [
        'bad_request' => 'Invalid request.',
        'honeypot'    => 'Message sent.',
        'invalid'     => 'Please enter your name, a valid email address and a message.',
        'too_long'    => 'The message is too long.',
        'ok'          => 'Thank you, your message has been sent.',
        'fail'        => 'Sending failed, please try again later or give us a call.',
    ],
];
$m = MESSAGES[$lang];

function respond(bool $ok, string $msg, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(false, $m['bad_request'], 405);

// Honeypot
if (!empty($_POST['website'])) respond(true, $m['honeypot']);

// header injection protection
$line = fn(string $k): string => trim(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')));

$name    = $line('name');
$email   = $line('email');
$subject = $line('subject') ?: 'Poptávka z webu';
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, $m['invalid'], 422);
}
if (mb_strlen($name) > 100 || mb_strlen($subject) > 150 || mb_strlen($message) > 5000) {
    respond(false, $m['too_long'], 422);
}


$body = "Jméno: $name\nE-mail: $email\n\n$message\n";

$headers = [
    'From'         => 'Web Autodoprava Ryšavý <' . FROM . '>',
    'Reply-To'     => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];
$headerStr = '';
foreach ($headers as $k => $v) {
    $headerStr .= $k . ': ' . ($k === 'From' ? mb_encode_mimeheader(explode(' <', $v)[0], 'UTF-8') . ' <' . FROM . '>' : $v) . "\r\n";
}

$ok = mail(TO, mb_encode_mimeheader('[Web] ' . $subject, 'UTF-8'), $body, $headerStr);

$ok ? respond(true, $m['ok'])
    : respond(false, $m['fail'], 500);