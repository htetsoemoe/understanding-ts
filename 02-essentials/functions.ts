// function with types

// Return type
function add(a: number, b: number): number {
    return a + b;
}


// Void type
function log(msg: string): void {
    console.log(msg);
}


// Never type
function logAndThrow(errorMessage: string): never {
    console.log(errorMessage);
    throw new Error(errorMessage)
}

// Function as Type
function performJob(cb: (msg: string) => void) {
    //...
    cb("Job done!");
}

performJob(log)


type People = {
    name: string;
    age: number;
    greet: () => string;
}

let yuki: People = {
    name: 'yuki',
    age: 20,
    greet() {
        console.log("Hello there!");
        return this.name;
    }
}

yuki.greet();