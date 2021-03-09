import { TodoItem } from '../../models/TodoItem';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import * as uuid from 'uuid'
import { getUserId } from '../utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { TodoItemAccess } from '../todoAccess';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
const todoAccess = new TodoItemAccess()

export async function createTodo(event: APIGatewayProxyEvent): Promise<TodoItem> {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  const id = uuid.v4();
  const userId = getUserId(event);
  
  const fullTodoItem: TodoItem = {
    ...newTodoItem,
    createdAt: new Date().toISOString(),
    done: false,
    todoId: id,
    userId
  }

  await todoAccess.createTodo(fullTodoItem) // data access layer

  return fullTodoItem;
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  await todoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(event: APIGatewayProxyEvent) {
  const userId = getUserId(event);
  const allTodos = await todoAccess.getTodos(userId);
  return allTodos;
} 

export async function updateTodo(event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const fullTodoItem =  await todoAccess.updateTodo(todoId, userId, updatedTodo);
  return fullTodoItem;
} 

