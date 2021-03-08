import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess'
import { getUserId } from '../utils'
const todoAccess = new TodoItemAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  try {
    await todoAccess.deleteTodo(todoId, userId);

    return { 
      statusCode: 200,
      body: JSON.stringify({ message: 'deleted' })
    }
  } catch (error) {
    console.log('error deleting todo', error)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error deleting todo'})
    }
  }
}
