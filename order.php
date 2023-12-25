<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Интернет-магазин</title>

    <!-- Icon -->
    <link rel="icon" type="image/ico" href="favicon.ico">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap" rel="stylesheet">

    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="styles.css" rel="stylesheet">

    <!-- JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>
    <header class="d-flex justify-content-center align-items-center">
        <a href="http://siteinternetcapability.000.pe/" class="agency-name">
            <img src="mibok.png"></img>
        </a>
    </header>

    <?php include 'processing.php';  ?>

    <main>
        <div class="container-fluid px-0">
            <div class="cart-section p-5 d-flex justify-content-end">
                <div class="cart-container position-relative">
                    <a href="order" class="cart-icon position-absolute">
                        <img src="basket.ico" alt="Cart">
                        <span class="badge bg-danger position-absolute">0</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="catalog d-flex flex-column flex-shrink-0 text-white">
            <div class="headercatalog d-flex justify-content-center align-items-center">
                <span class="fs-2">Каталог товаров</span>
            </div>
            <ul class="nav nav-pills flex-column mb-auto">
                <?php
                $sql = "SELECT * FROM Categories";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo '<li class="nav-item">
                            <a href="#submenu' . $row["ID"] . '" class="nav-link text-white py-2 rounded-0" data-bs-toggle="collapse">
                                ' . $row["Name"] . '
                            </a>
                        <div class="collapse" id="submenu' . $row["ID"] . '" style="background-color: #58a5f0;">';
                    
                        $sub_sql = "SELECT * FROM SubCategories WHERE ParCategory=" . $row["ID"];
                        $sub_result = $conn->query($sub_sql);
                        if ($sub_result->num_rows > 0) {
                            echo '<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">';
                            while($sub_row = $sub_result->fetch_assoc()) {
                                echo '<li class="subCategory pb-2 pt-2"><a href="http://siteinternetcapability.000.pe?subCategoryId=' . $sub_row["ID"] . '" class="link-light">' . $sub_row["Name"] . '</a></li>';
                            }
                            echo '</ul>';
                        }

                        echo '</div></li>';
                    }
                } else {
                    echo "0 results";
                }
                $conn->close();
                ?>
        </ul>
    </div>
        
    </main>

    <footer>
    </footer>

    <!-- JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="libraryOrder.js"></script>
</body>
</html>