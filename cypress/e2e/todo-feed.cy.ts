const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
  it("When load, renders the page", () => {
    cy.visit(BASE_URL);
  });

  it("When create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            uid: "746e7758-db3d-4063-9c8f-4fa84ab12af6",
            date: "2024-03-05T09:49:24.521Z",
            content: "Test todo",
            done: false,
          },
        },
      });
    }).as("createTodo");
    cy.visit(BASE_URL);
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Test todo");
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();
    cy.get("table > tbody").contains("Test todo");
  });
});
