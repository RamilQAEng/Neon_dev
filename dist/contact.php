<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$toEmail = 'qubitaibots@gmail.com';
$siteName = 'Neon Dev';

function field(string $name): string {
    return trim((string)($_POST[$name] ?? ''));
}

$name = field('name');
$contact = field('contact');
$price = field('price') !== '' ? field('price') : 'Тариф по задаче';
$plan = field('plan') !== '' ? field('plan') : 'Тариф по задаче';
$message = field('message');
$agree = field('personal_data_agree');
$privacyRead = field('privacy_read');
$consentVersion = field('consent_version') !== '' ? field('consent_version') : 'consent-2026-05-11';
$privacyVersion = field('privacy_version') !== '' ? field('privacy_version') : 'privacy-2026-05-11';

if ($name === '' || $contact === '' || $message === '' || $agree !== 'yes' || $privacyRead !== 'yes') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Заполните обязательные поля, подтвердите согласие и ознакомление с политикой.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mb_strlen($name) > 120 || mb_strlen($contact) > 180 || mb_strlen($price) > 80 || mb_strlen($plan) > 120 || mb_strlen($message) > 3000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Проверьте длину полей формы.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$subject = 'Новая заявка с сайта ' . $siteName;
$body = implode("\n", [
    'Новая заявка с сайта ' . $siteName,
    '',
    'Имя: ' . $name,
    'Контакт: ' . $contact,
    'Тариф: ' . $plan,
    'Стоимость: ' . $price,
    'Согласие на обработку ПД: yes',
    'Версия согласия: ' . $consentVersion,
    'Политика конфиденциальности: ознакомлен',
    'Версия политики: ' . $privacyVersion,
    '',
    'Сообщение:',
    $message,
    '',
    'Дата/время сервера: ' . date('c'),
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? ''),
    'User-Agent: ' . ($_SERVER['HTTP_USER_AGENT'] ?? ''),
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'neon-dev.ru'),
    'Reply-To: ' . $toEmail,
];

$sent = mail($toEmail, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Сервер не смог отправить письмо. Напишите в Telegram.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
