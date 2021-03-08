import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const todoAccess = new TodoItemAccess()
const bucketName = process.env.TODOS_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  console.log(newTodoItem)
  const id = uuid.v4();
  const userId = getUserId(event);
  console.log('user id', userId)
  
  const fullTodoItem: TodoItem = {
    ...newTodoItem,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${id}`,
    todoId: id,
    userId
  }

  try {
    await todoAccess.createTodo(fullTodoItem)

    return { 
      statusCode: 200,
      body: JSON.stringify({ item: fullTodoItem })
    }
  } catch (error) {
    console.log('error creating todo', error)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error creating todo'})
    }
  }
}