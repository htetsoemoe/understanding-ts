// ?. = Optional Chain
// “If this exists, use it. Otherwise, return undefined.”

function generateError(msg?: string) {
    throw new Error(msg);
}

type User = {
    name: string;
    age: number;
    role?: 'admin' | 'user'
}