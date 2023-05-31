"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCar = exports.sum = void 0;
const sum = (a, b) => a + b;
exports.sum = sum;
class Car {
    constructor(year, price) {
        this.year = year;
        this.price = price;
    }
}
const myCar = new Car("1993", 2500);
exports.myCar = myCar;
