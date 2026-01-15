// Nullish Coalescing
// “Use a default value ONLY if null or undefined.”

// Problem with || because || is too aggressive
const count = 0 || 10;
console.log(count); // => 10

// Solve with ??

const num = 0 ?? 10;
console.log(num); // => 0