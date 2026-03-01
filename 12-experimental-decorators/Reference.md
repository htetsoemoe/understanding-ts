# TypeScript Decorators TL;DR

Decorators are a special kind of declaration that can be attached to a **class**, **method**, **accessor**, **property**, or **parameter**. They use the `@expression` syntax, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration.

## **Key Takeaways**

- **Purpose**: Primarily used for meta-programming, adding metadata, or modifying the behavior of classes and their members without changing their source code.
- **Experimental Support**: In many projects (like this one), decorators are an experimental feature. They must be enabled in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "experimentalDecorators": true
    }
  }
  ```
- **Execution**: Decorators are executed when the class is *defined*, not when it is instantiated.
- **Decorator Factories**: Functions that return a decorator function. They allow you to pass configuration to a decorator:
  ```typescript
  function Logger(logString: string) {
    return function(constructor: Function) {
      console.log(logString);
      console.log(constructor);
    };
  }

  @Logger('LOGGING - PERSON')
  class Person {
    name = 'Max';
  }
  ```

## **Types of Decorators**

1.  **Class Decorators**: Applied to the class constructor. Used for observing, modifying, or replacing a class definition.
2.  **Method Decorators**: Applied to methods. Can be used to observe, modify, or replace a method definition.
3.  **Accessor Decorators**: Applied to getters/setters.
4.  **Property Decorators**: Applied to class properties. Note: They don't have access to the property value, only its metadata.
5.  **Parameter Decorators**: Applied to parameters of a method or constructor.

## **Execution Order**
- **Instance Members**: Property -> Accessor/Method -> Parameter -> Class.
- **Multiple Decorators**: Evaluated top-to-bottom (factory), but executed bottom-to-top.

## **More Useful Decorators: WithTemplate**

Decorators can also be used to render HTML templates and inject them into the DOM. This is particularly useful for UI frameworks or components.

```typescript
function WithTemplate(template: string, hookId: string) {
  return function<T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super(...args);
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}

@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}
```
This `WithTemplate` decorator takes a `template` string and a `hookId`. When the `Person` class is instantiated, the decorator intercepts the constructor, renders the template into the specified DOM element, and injects the instance's `name` property. This demonstrates how decorators can be used for advanced class manipulation and UI rendering.

### **Execution Order of `WithTemplate`**

The `WithTemplate` decorator is a class decorator factory. When applied, the inner decorator function is executed *after* the class definition is evaluated but *before* any instances of the class are created.

1.  **Decorator Factory Call**: `WithTemplate('<h1>My Person Object</h1>', 'app')` is called first. This returns the actual decorator function.
2.  **Decorator Function Execution**: The returned decorator function is then executed, receiving the `Person` class constructor as `originalConstructor`.
3.  **Class Replacement**: The decorator replaces the `Person` class with a new anonymous class that extends `originalConstructor`. This new class's constructor contains the logic to render the template and update the DOM.
4.  **Instance Creation**: When `new Person()` is called, the constructor of the *new* (decorated) class is executed. This is where the DOM manipulation (setting `innerHTML` and `textContent`) actually happens.

This order is crucial because it allows the decorator to modify the class's behavior at definition time and then execute additional logic during instance creation.

## **Diving Deeper into Decorator Types**

Based on common patterns, here's a breakdown of the arguments each decorator type receives and how they are used:

### **1. Property Decorators**
Applied to class properties. They execute when the property is *defined* in the prototype (for instance properties) or the constructor (for static properties).

```typescript
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
}
```
- **`target`**: The prototype of the class (for instance properties) or the constructor function (for static properties).
- **`propertyName`**: The name of the property.

### **2. Accessor Decorators**
Applied to getters or setters. They allow you to observe, modify, or replace the accessor's property descriptor.

```typescript
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target, name, descriptor);
}

class Product {
  @Log2
  set price(val: number) { /* ... */ }
}
```
- **`descriptor`**: A `PropertyDescriptor` object containing methods like `get`, `set`, `enumerable`, `configurable`.

### **3. Method Decorators**
Similar to accessor decorators, they are applied to class methods.

```typescript
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method decorator!');
  console.log(target, name, descriptor);
}

class Product {
  @Log3
  getPriceWithTax(tax: number) { /* ... */ }
}
```
- **`descriptor`**: Contains the method's implementation in `value`. You can wrap or replace this function to add behavior.

### **4. Parameter Decorators**
Applied to method or constructor parameters.

```typescript
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target, name, position);
}

class Product {
  getPriceWithTax(@Log4 tax: number) { /* ... */ }
}
```
- **`name`**: The name of the method the parameter belongs to.
- **`position`**: The index of the parameter in the method's parameter list (starting from 0).

---

**Note**: All these decorators execute at **class definition time**, not at instance creation time. This makes them ideal for registering metadata, setting up observability, or modifying class structures before any objects are actually created.

## **Returning (and Changing) a Class in a Class Decorator**

Class decorators have the unique ability to return a **new constructor function** (a new class) that will replace the original one. This allows you to add logic that runs when the class is *instantiated*.

```typescript
function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function<T extends { new (...args: any[]): {name: string} }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}
```

### **Key Features of this Pattern:**
- **Generic Constraint**: The `<T extends { new (...args: any[]): {name: string} }>` constraint ensures that the decorator is only applied to classes that can be instantiated and have a `name` property.
- **Class Extension**: By returning `class extends originalConstructor`, the new class inherits all properties and methods of the original class.
- **`super()`**: You must call `super()` in the new constructor to ensure the original class's initialization logic is executed.
- **Instantiation-Time Logic**: Logic inside the new `constructor` (like DOM manipulation) only runs when `new MyClass()` is called, even though the decorator itself was applied at class definition time.
- **Property Access**: Inside the new constructor, `this.name` correctly refers to the property defined in the original class.

## **Validation with Decorators**

Decorators can be used to implement a powerful validation framework. This involves using property decorators to register metadata about a class's requirements and a separate `validate` function to check those requirements at runtime.

### **The Validation Logic Flow**

1.  **Global Registry**: A global object (e.g., `registeredValidators`) stores the validation requirements for different classes and properties.
2.  **Property Decorators (`@Required`, `@PositiveNumber`)**: These decorators execute when the class is defined. They add metadata to the global registry, mapping class names and property names to specific validator types.
3.  **The `validate` Function**: A utility function that:
    -   Takes an object instance.
    -   Looks up the validation configuration for that object's class in the global registry.
    -   Iterates through the properties and their associated validators.
    -   Returns `true` if all validations pass, otherwise `false`.

### **Code Example**

```typescript
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // e.g., ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['required']
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['positive']
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) return true;
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}
```

### **Usage in Application**
When a user submits a form, you instantiate the class and then call `validate()` on that instance before proceeding. This decouples the validation rules (defined in the class) from the validation execution (handled by the utility function).


