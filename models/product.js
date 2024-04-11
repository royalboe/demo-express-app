
products = [];

// Product model class
exports.product = class Product
{
    // Constructor to instantiate products
    constructor(t)
    {
        this.title = t;
    }

    // Method to save the product
    save()
    {
        products.push(this);
    }

    // Static method to return products
    static fetchAll()
    {
        return products;
    }
}