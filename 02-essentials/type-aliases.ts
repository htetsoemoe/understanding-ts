// Type Aliases

type Role = 'admin' | 'editor' | 'guest' | 'reader'
type User = {
    name: string;
    age: number;
    role: Role; // TYPE ALIASES
    permissions: string[];
}