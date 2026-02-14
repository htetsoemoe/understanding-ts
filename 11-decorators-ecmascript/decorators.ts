// Class decorator
// logger accepts any number of constructor arguments
function logger<T extends new(...args: any[]) => any>(
    target: T,
    ctx: ClassDecoratorContext
) {
    console.log('logger decorator');
    console.log(target);
    console.log(ctx);

    return class extends target {
        constructor(...args: any[]) {
            super(...args);
            console.log("class constructor");
            console.log(this);
        }
    }
}

// Method decorator
function autobin(
    target: (...args: any[])  => any,
    ctx: ClassMethodDecoratorContext
) {
    ctx.addInitializer(function(this: any) {
        this[ctx.name] = this[ctx.name].bind(this);
    })

    // add more functionality into target function and bind with target function
    return function(this: any) {
        console.log("Executing before target(original) function...");
        target.apply(this);
        console.log("Executing after target(original) function...");
    }
}

// Field decorator and decorator factory
// The outer function is a 'Decorator Factory'.
// The inner function is a 'Field Decorator'.
function replacer<T>(initValue: T) {
    return function replaceDecorator(
        target: undefined,
        ctx: ClassFieldDecoratorContext
    ) {
        console.log(target);
        console.log(ctx);

        // override value
        return (initialValue: any) => {
            console.log(initialValue);
            return initValue
        }
    }
}

@logger
class Person {
    @replacer('John')
    name = "Bob";

    @autobin
    greet() {
        console.log(`Hi, I am ${this.name}`);
    }
}

const bob = new Person();
const greet = bob.greet;
bob.greet();