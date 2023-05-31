const sum = (a: number, b: number): number => a + b;

interface ICar {
  year: string;
  price: number;
}
class Car implements ICar {
  year: string;
  price: number;

  constructor(year: string, price: number) {
    this.year = year;
    this.price = price;
  }
}
const myCar = new Car("1993", 2500);

export { sum, myCar };
