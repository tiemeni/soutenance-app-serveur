const Product = require("../models/Product");


module.exports.calculateAmount = (array_) => {
    var amount = 0 
    array_.forEach(element => {
        amount += (element.amount * element.qte)
    });
    return amount
}