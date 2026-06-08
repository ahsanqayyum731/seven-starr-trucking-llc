<?php
/**
 * Seven Starr Trucking LLC - Backend Form Handler
 * Processes forms, stores data in local JSON databases, and sends SMTP emails via XAMPP.
 */

// Allow CORS and set JSON output headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Define Admin Email Address for testing
$admin_email = "sultan_mamun@hotmail.com";

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

// Get raw JSON input
$input_raw = file_get_contents("php://input");
$data = json_decode($input_raw, true);

if (!$data || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request payload or missing form type."]);
    exit;
}

$form_type = $data['type'];
$db_file = "";
$email_subject = "";
$email_body_admin = "";
$email_body_applicant = "";
$applicant_email = "";
$applicant_name = "";

// Create data directory if not exists
if (!is_dir("data")) {
    mkdir("data", 0755, true);
}

if ($form_type === 'driver') {
    $db_file = "data/drivers.json";
    $applicant_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $applicant_name = htmlspecialchars($data['name']);
    $email_subject = "New Driver Lease Application: " . $applicant_name;

    // Build Admin Email HTML
    $email_body_admin = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking - Driver Lease Application</h2>
        <p style='color:#8892B0;'>A new driver has submitted an application to lease onto Seven Starr Trucking's MC.</p>
        <table style='width:100%; border-collapse:collapse; margin-top:20px; color:#8892B0;'>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF; width:150px;'>Full Name:</td><td style='padding:8px 0;'>" . $applicant_name . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Company Name:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['company']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Phone Number:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['phone']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Email Address:</td><td style='padding:8px 0;'>" . $applicant_email . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Location:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['location']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Truck Number:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['truckNo']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Truck Type:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['truckType']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>OTR Experience:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['experience']) . " Years</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>MC Number:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['mc']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>DOT Number:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['dot']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Preferred States:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['states']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>CDL Document:</td><td style='padding:8px 0; color:#FF6B35;'>" . htmlspecialchars($data['cdlFile']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Insurance Document:</td><td style='padding:8px 0; color:#FF6B35;'>" . htmlspecialchars($data['insFile']) . "</td></tr>
        </table>
        <div style='background-color:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:6px; margin-top:20px;'>
            <h4 style='color:#E6F1FF; margin-top:0;'>Driver Notes:</h4>
            <p style='margin-bottom:0; font-style:italic; font-size:14px;'>" . nl2br(htmlspecialchars($data['notes'])) . "</p>
        </div>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC Admin Console System</p>
    </div>";

    // Build Applicant Confirmation HTML
    $email_body_applicant = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking LLC</h2>
        <h3>Dear " . $applicant_name . ",</h3>
        <p style='color:#8892B0;'>Thank you for submitting your application to lease onto Seven Starr Trucking's authority.</p>
        <p style='color:#8892B0;'>Our recruitment team is reviewing your qualification credentials (CDL, safety log history, insurance COI). A representative will contact you directly at <strong>" . htmlspecialchars($data['phone']) . "</strong> within 24 hours.</p>
        <div style='background-color:rgba(255,107,53,0.05); border-left:4px solid #FF6B35; padding:15px; border-radius:4px; margin:20px 0; color:#8892B0;'>
            <strong>Lease On benefits include:</strong>
            <ul style='margin:10px 0 0 20px; padding:0;'>
                <li>Punctual Weekly Settlements & Direct Deposits</li>
                <li>Proactive 24/7 Dispatchers</li>
                <li>Direct Broker Relations & High Cargo Rates</li>
            </ul>
        </div>
        <p style='color:#8892B0;'>If you have immediate queries, call our Hialeah logistics office at <strong>305-742-7190</strong>.</p>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC. 19900 NW 86th CT, Hialeah, FL 33015. DOT #4009071</p>
    </div>";

} elseif ($form_type === 'quote') {
    $db_file = "data/quotes.json";
    $applicant_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $applicant_name = htmlspecialchars($data['contact']);
    $email_subject = "New Shipper Freight Quote Request: " . htmlspecialchars($data['company']);

    // Build Admin Email HTML
    $email_body_admin = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking - Quote Request</h2>
        <p style='color:#8892B0;'>A shipper broker has requested a shipping lanes rate sheet quote.</p>
        <table style='width:100%; border-collapse:collapse; margin-top:20px; color:#8892B0;'>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF; width:150px;'>Company Name:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['company']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Contact Person:</td><td style='padding:8px 0;'>" . $applicant_name . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Phone Number:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['phone']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Email Address:</td><td style='padding:8px 0;'>" . $applicant_email . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF; color:#FF6B35;'>Pickup Location:</td><td style='padding:8px 0; font-weight:bold;'>" . htmlspecialchars($data['pickup']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF; color:#FF6B35;'>Delivery Location:</td><td style='padding:8px 0; font-weight:bold;'>" . htmlspecialchars($data['delivery']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Freight Commodity:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['freight']) . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Weight (lbs):</td><td style='padding:8px 0;'>" . number_format($data['weight']) . " lbs</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Trailer Type:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['trailer']) . "</td></tr>
        </table>
        <div style='background-color:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:6px; margin-top:20px;'>
            <h4 style='color:#E6F1FF; margin-top:0;'>Shipping Requirements:</h4>
            <p style='margin-bottom:0; font-style:italic; font-size:14px;'>" . nl2br(htmlspecialchars($data['notes'])) . "</p>
        </div>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC Admin Console System</p>
    </div>";

    // Build Applicant Confirmation HTML
    $email_body_applicant = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking LLC</h2>
        <h3>Dear " . $applicant_name . " (" . htmlspecialchars($data['company']) . "),</h3>
        <p style='color:#8892B0;'>Thank you for requesting a freight quote for the route: <strong>" . htmlspecialchars($data['pickup']) . " &rarr; " . htmlspecialchars($data['delivery']) . "</strong>.</p>
        <p style='color:#8892B0;'>Our dispatch desk is reviewing the current spot market lane rates and capacity index. We will send you an official rate sheet contract directly to your inbox shortly.</p>
        <p style='color:#8892B0;'>For emergency carrier setup, contact our Hialeah logistics office at <strong>305-742-7190</strong>.</p>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC. 19900 NW 86th CT, Hialeah, FL 33015. DOT #4009071</p>
    </div>";

} elseif ($form_type === 'contact') {
    $db_file = "data/messages.json";
    $applicant_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $applicant_name = htmlspecialchars($data['name']);
    $email_subject = "General Web Query: " . htmlspecialchars($data['subject']);

    // Build Admin Email HTML
    $email_body_admin = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking - Contact Query</h2>
        <table style='width:100%; border-collapse:collapse; margin-top:20px; color:#8892B0;'>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF; width:150px;'>Name:</td><td style='padding:8px 0;'>" . $applicant_name . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Email Address:</td><td style='padding:8px 0;'>" . $applicant_email . "</td></tr>
            <tr><td style='padding:8px 0; font-weight:bold; color:#E6F1FF;'>Subject:</td><td style='padding:8px 0;'>" . htmlspecialchars($data['subject']) . "</td></tr>
        </table>
        <div style='background-color:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:6px; margin-top:20px;'>
            <h4 style='color:#E6F1FF; margin-top:0;'>Message content:</h4>
            <p style='margin-bottom:0; font-style:italic; font-size:14px;'>" . nl2br(htmlspecialchars($data['message'])) . "</p>
        </div>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC Admin Console System</p>
    </div>";

    // Build Applicant Confirmation HTML
    $email_body_applicant = "
    <div style='background-color:#020C1B; color:#E6F1FF; font-family:sans-serif; padding:30px; border-radius:12px; max-width:600px; margin:0 auto; border:1px solid #FF6B35;'>
        <h2 style='color:#FF6B35; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;'>Seven Starr Trucking LLC</h2>
        <h3>Dear " . $applicant_name . ",</h3>
        <p style='color:#8892B0;'>Thank you for contacting Seven Starr Trucking LLC.</p>
        <p style='color:#8892B0;'>We have successfully logged your query. Our logistics coordinator will respond shortly to your email at <strong>" . $applicant_email . "</strong>.</p>
        <p style='font-size:12px; color:#8892B0; text-align:center; margin-top:30px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;'>Seven Starr Trucking LLC. 19900 NW 86th CT, Hialeah, FL 33015. DOT #4009071</p>
    </div>";
}

// 1. DATABASE: Read and write JSON records on server
$existing_records = [];
if (file_exists($db_file)) {
    $existing_records = json_decode(file_get_contents($db_file), true);
    if (!is_array($existing_records)) {
        $existing_records = [];
    }
}
$existing_records[] = $data;
file_put_contents($db_file, json_encode($existing_records, JSON_PRETTY_PRINT));

// 2. EMAIL: Dispatch mail using HTTPS API (Bypasses blocked SMTP ports 25/587/465)
function send_via_api($to, $subject, $body_content, $reply_to) {
    $url = "https://formsubmit.co/ajax/" . $to;
    
    // Clean and prepare message content
    $clean_msg = strip_tags(str_replace("<br>", "\n", $body_content));
    $clean_msg = str_replace("</td></tr>", "\n", $clean_msg);
    $clean_msg = str_replace("</td>", ": ", $clean_msg);
    
    $post_data = [
        "_subject" => $subject,
        "_replyto" => $reply_to,
        "message" => $clean_msg
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // prevents local SSL chain validation issues
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ($http_code === 200);
}

// Send to Admin (sultan_mamun@hotmail.com)
$admin_mail_status = send_via_api($admin_email, $email_subject, $email_body_admin, $applicant_email ?: $admin_email);

// Send copy confirmation to Applicant
$applicant_mail_status = false;
if ($applicant_email) {
    $applicant_mail_status = send_via_api($applicant_email, "Seven Starr Submission Confirmation", $email_body_applicant, $admin_email);
}

// Return JSON response details
echo json_encode([
    "status" => "success",
    "message" => "Database record logged successfully.",
    "admin_email_sent" => $admin_mail_status,
    "applicant_email_sent" => $applicant_mail_status,
    "target_admin" => $admin_email,
    "target_applicant" => $applicant_email
]);
exit;
