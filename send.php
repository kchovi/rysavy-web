<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

const TO   = 'chovanec@pccomp.eu';
const FROM = 'web@adrysavy.cz';  

function respond(bool $ok, string $msg, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(false, 'Neplatný požadavek.', 405);

// Honeypot
if (!empty($_POST['website'])) respond(true, 'Zpráva odeslána.');

//header injection protection stuff
$line = fn(string $k): string => trim(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')));

$name    = $line('name');
$email   = $line('email');
$subject = $line('subject') ?: 'Poptávka z webu';
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Vyplňte prosím jméno, platný e-mail a zprávu.', 422);
}
if (mb_strlen($name) > 100 || mb_strlen($subject) > 150 || mb_strlen($message) > 5000) {
    respond(false, 'Zpráva je příliš dlouhá.', 422);
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

$ok ? respond(true, 'Děkujeme, zpráva byla odeslána.')
    : respond(false, 'Odeslání se nezdařilo, zkuste to prosím později nebo nám zavolejte.', 500);