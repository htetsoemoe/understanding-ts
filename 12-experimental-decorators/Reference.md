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
