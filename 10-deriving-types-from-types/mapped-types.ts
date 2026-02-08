type Operations = {
   readonly add: (a: number, b: number) => number;
   readonly subtract: (a: number, b: number) => number;
}

type Result<T> = {
    [Key in keyof T]?: number
}

let mathOperations: Operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
}

let mathResults: Result<Operations> = {
    add: mathOperations.add(5, 3),
    // subtract: mathOperations.subtract(10, 4),
}

// mathResults.add = 20