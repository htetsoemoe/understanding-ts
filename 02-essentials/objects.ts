let user: {
    name: string;
    age: number | string;
    hobbies: string[];
    role: {
        description: string;
        id: number;
    }
} = {
    name: "Joe",
    age: 35,
    hobbies: ["Guitar", "Coding"],
    role: {
        description: "developer",
        id: 7
    }
}

// Must not be 'null' or 'undefined' type
let val: {} = "must not be null or undefined type"