import { supabase } from "@server/infra/db/supabase";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, TodoSchema } from "@server/schema/todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit - 1;

  const { data, error, count } = await supabase()
    .from("todos")
    .select("*", { count: "exact" })
    .range(startIndex, endIndex)
    .order("date", { ascending: false });

  if (error) throw new Error("Failed to get todos");

  const parsedData = TodoSchema.array().safeParse(data);
  if (!parsedData.success) {
    throw new Error("Failed to parse todos");
  }
  const todos = data as Todo[];
  const total = count || todos.length;
  const totalPages = Math.ceil(total / currentLimit);
  return { todos, total, pages: totalPages };

  // const currentPage = page || 1;
  // const currentLimit = limit || 10;
  // const ALL_TODOS = read().reverse();

  // const startIndex = (currentPage - 1) * currentLimit;
  // const endINdex = currentPage * currentLimit;
  // const paginatedTodos = ALL_TODOS.slice(startIndex, endINdex);
  // const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  // return {
  //     todos: paginatedTodos,
  //     total: ALL_TODOS.length,
  //     pages: totalPages,
  // };
}

async function getTodoById(uid: string): Promise<Todo> {
  const { data, error } = await supabase()
    .from("todos")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) throw new Error("Failed to get todo by uid");

  const parsedData = TodoSchema.safeParse(data);
  if (!parsedData.success) throw new Error("Failed to parse TODO created");

  return parsedData.data;
}
async function createdByContent(content: string): Promise<Todo> {
  const { data, error } = await supabase()
    .from("todos")
    .insert([{ content }])
    .select()
    .single();

  if (error) throw new Error("Failed to create a todo");
  const parsedData = TodoSchema.parse(data);
  return parsedData;
}

async function toggleDone(uid: string): Promise<Todo> {
  const todo = await getTodoById(uid);

  const { data, error } = await supabase()
    .from("todos")
    .update({ done: !todo.done })
    .eq("uid", uid)
    .select()
    .single();

  if (error) throw new HttpNotFoundError(`Failed to delete todo: ${uid}`);

  const parsedData = TodoSchema.parse(data);

  return parsedData;

  // const todo = read().find((todo) => todo.uid === uid);
  // if (!todo) throw new HttpNotFoundError(`Todo with id ${uid} not found`);
  // const updatedTodo = update(todo.uid, { done: !todo.done });
  // return updatedTodo;
}

async function deleteByUid(uid: string) {
  const { error } = await supabase().from("todos").delete().match({ uid });
  if (error) throw new HttpNotFoundError(`Todo with id ${uid} not found`);
  // const todo = read().find((todo) => todo.uid === uid);
  // if (!todo) throw new HttpNotFoundError(`Todo with id ${uid} not found`);
  // dbDeleteByID(uid);
}
export const todoRepository = {
  get,
  createdByContent,
  toggleDone,
  deleteByUid,
};
