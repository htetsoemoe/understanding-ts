// class User {
//     name: string;
//     age: number;

//     constructor(n: string, a: number) {
//         this.name = n;
//         this.age = a;
//     }
// }

// new User("bob", 30);


class People {
    hobbies: string[] = [];

    constructor(public name: string, public age: number) {}

    greet() {
        console.log('My age: ' + this.age);
    }
}

const alice = new People("alice", 30);
const bob = new People("bob", 33);
bob.hobbies.push('Reading')

