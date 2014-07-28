function SpecialsScreen() {

    var self = this;

    // Define HTML elements
    self.productsDiv = "#products";
    self.selectButtonDiv = "selectButton";

    // Method to display list of all products
    // ___Params___
    // products: Array of valid product objects to display
    self.displayProductList = function (products) {
        var pDiv = "";
        // Build HTML from template for each product in array
        products.forEach(function (prod) {
            pDiv += ' <div class="row" >';
            pDiv += '<div class="col-md-1"></div>';
            pDiv += '<div class="col-md-1">' + prod.ProductID + '</div>';
            pDiv += '<div class="col-md-1"><input type="checkbox" class="squaredTwo" name="" value="' + prod.ProductID + '"/></div>';
            pDiv += '<div class="col-md-3">' + prod.Name + '</div>';
            pDiv += '<div class="col-md-5">' + prod.Description + '</div>';
            pDiv += '<div class="col-md-1">' + prod.SalePrice + '</div>';
            pDiv += '</div>';
        });
        // Add complete HTML to product element
        $(self.productsDiv).html(pDiv);
    }

    // Method to clear the screen
    self.clearScreen = function () {
        $(self.productsDiv).html('');
    }

    // Method to show or hide Selection Button
    // ___Params___
    // setVisible: boolean value to show or hide the select button
    self.selectButton = function (setVisible) {
        if (setVisible) {
            document.getElementById(self.selectButtonDiv).style.visibility = "visible";
        } else {
            document.getElementById(self.selectButtonDiv).style.visibility = "hidden";
        }
    }

    // Method to display selected special products
    // ___Params___
    // products: Array of valid product objects to display
    self.displaySpecialProducts = function (products) {
        var pDiv = "";
        // Build HTML from template for each product in array
        products.forEach(function (prod) {
            pDiv += '<div class="row chalk_50 ">';
            pDiv += '<div class="col-md-2"></div>';
            // Change display if product is out of stock
            if (prod.Stock == 0) {
                pDiv += '<div class="col-md-6 empty_stock">' + prod.Name + '</div>';
            } else {
                pDiv += '<div class="col-md-6">' + prod.Name + '</div>';
            }
            pDiv += '<div class="col-md-1">£' + self.fixPriceDisplay(prod.SalePrice) + '</div>';
            pDiv += '<div class="col-md-1"></div>';
            pDiv += self.displayStock(prod.Stock);
            pDiv += '</div>';
        });
        // Add complete HTML to product element
        $(self.productsDiv).html(pDiv);
    }

    // Method to display double digits prices correctly
    // ___Params___
    // price: The price value to be displayed
    self.fixPriceDisplay = function (price) {
        return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Method to return HTML representation of stock value
    // ___Params___
    // stock: The products stock value
    self.displayStock = function (stock) {
        var inStock = stock / 10;
        // Only show maximum of 10 'tallies'
        if (inStock > 10) inStock = 10;
        var stockDisplay = "";
        // Generate HTML for stock value
        for (var i = 0; i < inStock; i++) {
            stockDisplay += '/';
        }
        // For any 'tallies' to represent not in stock, generate out of stock 'tallies'
        for (var i = 0; i <= 9 - inStock; i++) {
            stockDisplay += '<span class="empty_stock">/</span>';
        }
        return stockDisplay;
    }
}



