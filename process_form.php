<?php
header('Content-Type: application/json');

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Validate inputs
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Prepare email
$to = 'info@mamidi.co.in';
$email_subject = "Contact Form: " . ($subject ?: 'New Message');
$email_body = "You have received a new message from your website contact form.\n\n".
    "Name: $name\n".
    "Email: $email\n".
    "Subject: $subject\n\n".
    "Message:\n$message";
$headers = "From: $email\n";
$headers .= "Reply-To: $email";

// Send email
$mail_success = mail($to, $email_subject, $email_body, $headers);

// Return response
echo json_encode([
    'success' => $mail_success,
    'message' => $mail_success ? 'Thank you for your message. We will get back to you soon!' : 'Sorry, there was an error sending your message.'
]);
?>
