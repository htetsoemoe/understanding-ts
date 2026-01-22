interface Authenticatable {
    email: string;
    password: string;

    login(): void;
    logout(): void;
}

// Demonstrate `Interface merging` in TypeScript
/**
 *
    Interface merging, a form of TypeScript's "declaration merging," 
    is an automatic compiler feature that combines multiple interface declarations 
    with the same name into a single, unified interface. 

    This allows for the incremental definition of an interface and is particularly 
    useful for extending types from existing libraries or organizing large 
    interfaces across multiple files. 
 */

interface Authenticatable {
    role: string
}

let user: Authenticatable
user = {
    email: 'test@example.com',
    password: '1234',
    role: 'user',

    login() {
        
    },

    logout() {
        
    },
}

// Implementing Interface
class AuthenticateUser implements Authenticatable {
    constructor(
        public email: string,
        public password: string,
        public role: string,
        public department: string, // we can extend new property
    ) {}

    login(): void {
        
    }

    logout(): void {
        
    }

    getKPI(): any { // we can extend new function

    }

}


// Ensuring base types with Interface
function authenticate(user: AuthenticateUser) {
    console.log(
        user.email,
        user.password,
        user.department,
        user.getKPI()
    )
}


// Extending Interfaces
interface AuthenticatableAdmin extends Authenticatable {
    role: "superadmin" | "admin"
}