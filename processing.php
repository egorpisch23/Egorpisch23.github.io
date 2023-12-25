<?php
$servername = "sql303.infinityfree.com";
$username = "if0_35651071";
$password = "WVQg4HlMtg6nzxW";
$dbname = "if0_35651071_products";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$products = [];
if (isset($_GET['subCategoryId'])) {
    $subCategoryId = $conn->real_escape_string($_GET['subCategoryId']);
    $sql = "SELECT * FROM products WHERE ParSubCategory = $subCategoryId";
    $result = $conn->query($sql);
    
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

$subCategories = [];

$result = $conn->query("SELECT ID, Name FROM SubCategories");
while ($row = $result->fetch_assoc()) {
    $subCategories[$row['ID']] = $row['Name'];
}

function getSubCategoryName($subCategoryId) {
    global $subCategories;
    return isset($subCategories[$subCategoryId]) ? $subCategories[$subCategoryId] : "Неизвестно";
}
?>