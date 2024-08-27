
class Item {
    name;
    price;

    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}


class Order {
    items;
    hasMemberCard;

    constructor() {
        this.items = [];
        this.hasMemberCard = false;
    }

    addItem(item, amount) {
        for (let i = 0; i < amount; i++) {
            this.items.push(item);
        }
    }

    getOrders() {
        return this.items;
    }

    getMemberCard() {
        return this.hasMemberCard;
    }

    setMemberCard(hasMemberCard) {
        this.hasMemberCard = hasMemberCard;
    }
}

class Store {
    items;

    constructor() {
        this.items = [
            new Item("Red set", 50),
            new Item("Green set", 40),
            new Item("Blue set", 30),
            new Item("Yellow set", 50),
            new Item("Pink set", 80),
            new Item("Purple set", 90),
            new Item("Orange set", 120),
        ];
    }

    getItem(name) {
        return this.items.find(i => i.name === name);
    }
}

class Calculator {
    memberDiscount;
    bundleDiscount;
    discountItems;

    constructor() {
        this.memberDiscount = 0.1;
        this.bundleDiscount = 0.05;
        this.discountItems = ["Orange set", "Pink set", "Green set"];
    }

    applyBundleDiscount(totalPrice, items) {
        let discount = this.discountItems.reduce((acc, discountItemName) => {
            if (!items.some(item => item.name === discountItemName)) {
                return acc;
            }
            const itemCount = items.filter(item => item.name === discountItemName).length;
            const itemPrice = items.find(item => item.name === discountItemName).price;
            const pairs = Math.floor(itemCount / 2);
            return acc + (pairs * this.bundleDiscount * itemPrice * 2);
        }, 0);

        return totalPrice - discount;
    }

    calculatePrice(items, hasMemberCard) {
        let totalPrice = 0;
        for (let i = 0; i < items.length; i++) {
            totalPrice += items[i].price;
        }
        totalPrice = this.applyBundleDiscount(totalPrice, items);
        if (hasMemberCard) {
            totalPrice = totalPrice * (1 - this.memberDiscount);
        }

        this.printInfo(items, hasMemberCard, totalPrice);
        return totalPrice;
    }

    printInfo(items, hasMemberCard, totalPrice) {
        console.log("\n--------------");
        console.log("Items: ", items.map(i => i.name));
        console.log("Has member card: ", hasMemberCard);
        console.log("Total price: ", totalPrice + " THB");
    }

}

// Unit Tests
function runTests() {
    let calculator = new Calculator();
    let order = new Order();
    let store = new Store();
    let result;

    // Test 1: No discounts
    order = new Order();
    order.addItem(store.getItem("Red set"), 1);
    order.addItem(store.getItem("Green set"), 1);
    result = calculator.calculatePrice(order.getOrders(), order.getMemberCard());
    console.assert(result === 90, `Test 1 failed: ${result}`);

    // Test 2: With member card
    order = new Order();
    order.addItem(store.getItem("Red set"), 1);
    order.addItem(store.getItem("Green set"), 1);
    order.setMemberCard(true);
    result = calculator.calculatePrice(order.getOrders(), order.getMemberCard());
    console.assert(result === 81, `Test 2 failed: ${result}`); // (50 + 40) * .9

    // Test 3: Discounts on Orange sets
    order = new Order();
    order.addItem(store.getItem("Orange set"), 5);
    result = calculator.calculatePrice(order.getOrders(), order.getMemberCard());
    console.assert(result === 576, `Test 3 failed: ${result}`); // (120 * 2 * .95) + (120 * 2 * .95) + 120

    // Test 4: Mixed discounts
    order = new Order();
    order.addItem(store.getItem("Green set"), 2);
    order.addItem(store.getItem("Pink set"), 2);
    order.addItem(store.getItem("Orange set"), 4);
    result = calculator.calculatePrice(order.getOrders(), order.getMemberCard());
    console.assert(result === 684, `Test 4 failed: ${result}`); // (40 + 40 + 80 + 80 + 120 + 120 + 120 + 120) * .95

    console.log('All tests completed');
}

runTests(); // use `node [filename]` or paste in browser console to run the tests