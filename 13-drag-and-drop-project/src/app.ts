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

    // Method to handle form submission
    private submitHandler(event: Event) {
        event.preventDefault()
        console.log(this.titleInputElement.value)
    }

    // Method to configure event listeners for the form
    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    // Method to attach the form element to the DOM
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput()