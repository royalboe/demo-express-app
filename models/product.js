const fs = require('fs');
const path = require('path');

const rootDir = require("../util/path");

const p = path.join(rootDir, 'data', 'products.json');
// Product model class
module.exports = class Product
{
    // Constructor to instantiate products
    constructor(t)
    {
        this.title = t;
    }

    // Method to save the product
    save()
    {
        fs.readFile(p, (err, fileContent) =>
        {
            let products = [];
            if (!err)
            {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) =>
            {
                console.log(err);
            });
        });
    }

    // Static method to return products
    static fetchAll(cb)
    {
        fs.readFile(p, (err, fileContent) =>
        {
            if (err)
            {
                return cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
};