"use client";
import React, { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";
interface HomeTodo {
  uid: string;
  content: string;
  done: boolean;
}
function Page() {
  const initalLoadComplete = useRef(false);
  const [totalPages, setTotalPages] = useState(0);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoContent, setNewTodoContent] = useState("");
  const homeTodos = todoController.filterTodosbyContent<HomeTodo>(
    todos,
    search
  );

  const hasNoItems = homeTodos.length === 0 && isLoading === false;
  const hasMorePages = totalPages > page;

  useEffect(() => {
    if (!initalLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTotalPages(pages);
          setTodos(todos);
        })
        .finally(() => {
          setIsLoading(false);
        });
      initalLoadComplete.current = true;
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="indigo" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccsess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setNewTodoContent("");
              },
              onError() {
                alert("Você precisa  ter um conteúdo para criar uma TODO");
              },
            });
          }}
        >
          <input
            name="add-todo"
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodoContent}
            onChange={function newTodoHandler(event) {
              setNewTodoContent(event.target.value);
            }}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {!isLoading &&
              homeTodos.map((todo) => {
                return (
                  <tr key={todo.uid}>
                    <td>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={function handleToggle() {
                          todoController.toggleDone({
                            uid: todo.uid,
                            updateTodoOnScreen() {
                              setTodos((currentTodos) => {
                                return currentTodos.map((currentTodo) => {
                                  if (currentTodo.uid === todo.uid) {
                                    return {
                                      ...currentTodo,
                                      done: !currentTodo.done,
                                    };
                                  }
                                  return currentTodo;
                                });
                              });
                            },
                            onError() {
                              alert("Falha ao atualizar a TODO");
                            },
                          });
                        }}
                      />
                    </td>
                    <td>{todo.uid.substring(0, 4)}</td>
                    <td>
                      {!todo.done && todo.content}
                      {todo.done && <s>{todo.content}</s>}
                    </td>
                    <td align="right">
                      <button
                        data-type="delete"
                        onClick={function handleClick() {
                          todoController
                            .deleteById(todo.uid)
                            .then(() => {
                              setTodos((currentTodos) => {
                                return currentTodos.filter((currentTodo) => {
                                  return currentTodo.uid !== todo.uid;
                                });
                              });
                            })
                            .catch(() => {
                              console.error("Fail to delete");
                            });
                        }}
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                );
              })}
            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}
            {hasNoItems && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}
            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTotalPages(pages);
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page} Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
export default Page;
