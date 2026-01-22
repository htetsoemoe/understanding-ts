class User {
    // constructor(private firstName: string, private secondName: string) {}

    private _firstName: string = '';
    private _secondName: string = '';

    protected _id: string = '';

    // Setter
    set firstName(name: string) {
        if (name.trim() === '') {
            throw new Error('Invalid name.');
        }
        this._firstName = name;
    }

    set secondName(name: string) {
        if (name.trim() === '') {
            throw new Error('Invalid name.');
        }
        this._secondName = name;
    }

    // Getter 
    get fullName() {
        return this._firstName + ' ' + this._secondName
    }

    // Static variable and method (class level) can use as "Utility class which has a bunch of utility methods"
    static eid = "USER";

    static greet() {
        console.log('Hello!');
    }
}

const john = new User();
john.firstName = 'John'; // Setter can use as 'property'
john.secondName = 'Doe';
console.log(john.fullName); // Getter can use as 'property'

console.log(User.eid); // 
User.greet();


// Protected variable
// john._id

class John extends User {
    constructor(public jobTitle: string) {
        super();
    }

    work() {
        console.log(this._id); // child class can access protected variable
    }
}

// Abstract class
abstract class  UIElement {
    constructor(public identifier: string) {
        
    }

    clone(targetLocation: string) {
        // logic to duplicate the UI element
    }
}

class SideDrawerElement extends UIElement {
    constructor(public identifier: string, public position: 'left' | 'right') {
        super(identifier)
        
    }
}