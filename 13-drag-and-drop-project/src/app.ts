// Project Status Type
enum ProjectStatus {
    Active,
    Finished
}

// Project Class
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener = (items: Project[]) => void


// Project State Management
class ProjectState {
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor() {}
    
    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn)
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )
        this.projects.push(newProject)
        // Call all listener functions to update the UI
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()) // Pass a copy of the projects array
        }
    }
}


// Create a singleton instance of ProjectState
const projectState = ProjectState.getInstance()


// autobind decorator to automatically bind 'this' context
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() { 
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

// Validation 
interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable) {
    let isValid = true
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if (
        validatableInput.minLength != null &&
        typeof validatableInput.value === 'string'
    ) {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if (
        validatableInput.maxLength != null &&
        typeof validatableInput.value === 'string'
    ) {
        isValid = isValid && validatableInput.value.length >= validatableInput.maxLength
    }
    if (
        validatableInput.min != null &&
        typeof validatableInput.value === 'number'
    ) {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if (
        validatableInput.max != null &&
        typeof validatableInput.value === 'number'
    ) {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}

// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLElement
    assignedProjects: any[] = []

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById(
            'project-list'
        )! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        )

        // Get the first element from the imported content and cast it to HTMLElement
        // first element is the <section> element in the template
        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-projects`

        // Register a listener to update the assignedProjects and re-render the list when the state changes
        projectState.addListener((projects: any[]) => {
            this.assignedProjects = projects;
            this.renderProjects()
        })

        this.attach()
        this.renderContent()
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li')
            listItem.textContent = prjItem.title
            listEl.appendChild(listItem)
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
        this.element.querySelector('ul')!.id = listId
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
}

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById(
            'project-input'
        )! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        // Import the template content and clone it
        const importedNode = document.importNode(
            this.templateElement.content,
            true
        )

        // Get the first element from the imported content and cast it to HTMLFormElement
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        // Append the form element to the host element
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure()
        this.attach()
    }

    // Method to gather user input from the form fields
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = +this.peopleInputElement.value // Convert string to number

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 50
        }

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('Invalid input, please try again!')
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    // Method to clear the input fields after submission
    private clearInputs() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    // Method to handle form submission
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput
            projectState.addProject(title, desc, people)
            this.clearInputs()
        }
    }
  
    // Method to configure event listeners for the form
    private configure() {
        this.element.addEventListener('submit', this.submitHandler)

        // this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    // Method to attach the form element to the DOM
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput()

const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')