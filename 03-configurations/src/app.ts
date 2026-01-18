// import fs from 'node:fs';

let userName: string;

userName = "Alice";
console.log(userName);

function add(a: number, b: number): number {
    return a + b;
}
console.log(add(7, 10));


function greet(name: string): string {
    return `Hello, ${name}!`;
}
console.log(greet("Bob"));
