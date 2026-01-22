// keyof

type Robot = {
    id: string;
    name: string;
    model: string
}

type RobotKeys = keyof Robot
const oneOfRobotKey: RobotKeys = "name"



// Index Signature
type NumberObj = {
    [index: number]: string;
}

const products: NumberObj = {
    1: "Laptop",
    2: "Phone",
    3: "Tablet"
}

console.log(products)


type StatusObj = {
    [index: string]: boolean;
}

const state: StatusObj = {
    "isActive": true,
    "isRedeem": false,
}

console.log(state)


// key in union type
type UserKeys = "name" | "age" | "email"

type UnionObj = {
    [key in UserKeys]: string
}

const personOne: UnionObj = {
    name: "joe",
    age: "25",
    email: "joe@example.com"
}