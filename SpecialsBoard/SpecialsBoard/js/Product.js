function Product() {
    var self = this;

    // Define URI routes for API
    self.productURI = 'https://api.eposnowhq.com/v1/product/';
    self.stockUIR = 'https://api.eposnowhq.com/api/v1/productstock/';

    // Define your API access key
    self.API_KEY = 'ENTER YOUR API KEY HERE';

    // Array to hold all products from API
    self.products = new Array();

    // Array to hold all selected product IDs
    self.selectedProductsIDs = new Array();

    // Array to hold selected product objects
    self.specialProducts = new Array();

    // New instance of the SpecialsScreen - defined in SpecialScreen.js
    var screen = new SpecialsScreen();

    // Refresh rate for screen, i.e polling interval (In seconds)
    self.screenRefreshRate = 2;

    // Base method for calling the API itself
    // Returns the response from the call
    // ___Params___
    // uri: The URI the request is going to i.e https://api.eposnowhq.com/v1/product/
    // method: The request verb i.e POST, GET, PUT/PATCH, DELETE
    // data: Any data to pass, must be of correct format, in this case JSON
    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            accepts: "application/json",
            dataType: 'json',
            data: JSON.stringify(data),
            crossDomain: true,
            beforeSend: function (xhr) {
                //Sets Basic Authorization header necessary for API calls using key defined at top
                xhr.setRequestHeader("Authorization", "Basic " + self.API_KEY);
            },
            error: function (jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };
        return $.ajax(request);
    }

    // Method to return the current stock level for each product selected on the board
    self.getStockForProduct = function () {
        // For all selected products
        self.specialProducts.forEach(function (prod) {
            // Request stock level from API
            self.ajax(self.stockUIR + "?ProductID=" + prod.ProductID, "GET").done(function (data) {
                if (data != null) {
                    data.forEach(function (st) {
                        // Update stock level from response
                        prod.Stock = st.CurrentStock;
                    });
                }
            });
        });
    }

    // Method to get all products from the API and display them on the specials board for selection
    self.getAllProducts = function () {
        // Request all products from API
        var req = self.ajax(self.productURI, "GET");
        req.done(function (data) {
            // Store all products
            self.products = data;
            // Display products on-screen
            screen.displayProductList(data);
        });
        req.fail(function (jqXHR, textStatus) {
            console.log("Request failed: " + textStatus);
        });
    }

    // Method to store the productID and product of each selected product on the specials board
    self.getProductSelection = function () {
        // For each checked product in the product display
        $("#products").find("input:checked").each(function (i, ob) {
            // Store ID
            self.selectedProductsIDs.push($(ob).val());
        });
        // For each of the stored product IDs
        self.selectedProductsIDs.forEach(function (productID) {
            // Store the product object itself
            self.specialProducts.push(self.products.get(productID));
        });
    }

    // Method to display selected products on special board
    self.select = function () {
        // Get selected productIDs
        self.getProductSelection();
        // Get product objects for those IDs
        self.addPropertyToSelected();
        // get stock for each selected product
        self.getStockForProduct();
        // Clear screen
        screen.clearScreen();
        // Hide selection button
        screen.selectButton(false);
        // Display selected products and stock
        self.displaySelected();
    }

    self.displaySelected = function () {
        // Display products on screen 
        screen.displaySpecialProducts(self.specialProducts);
        // Refresh stock and screen at defined intervals
        self.refreshScreen();
    }

    // Method to add stock property to product object
    self.addPropertyToSelected = function () {
        // For each object of special product selected
        self.specialProducts.forEach(function (prod) {
            // Add stock property
            prod["Stock"] = 0;
        });
    }

    // Method to refresh stock levels and display on screen
    self.refreshScreen = function () {
        setInterval(function () {
            // Get stock for each selected product
            self.getStockForProduct();
            // Display products on screen
            screen.displaySpecialProducts(self.specialProducts);        
        }, self.screenRefreshRate * 1000); // screenRefreshRate defined in seconds, times by 1000 as milliseconds required.
    }
}

// Override for array get method
// Returns the product by ID
// ___Params___
// pId: The ID of the product to return
Array.prototype.get = function (pId) {
    // For each product entry in the array
    for (var i = 0, len = this.length; i < len; i++) {
        // Ensure it is of correct type object
        if (typeof this[i] != "object") continue;
        // Return object from array that matches the given ID
        if (this[i].ProductID == pId) {
            return this[i];
        }
    }
};