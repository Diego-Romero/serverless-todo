import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const todoAccess = new TodoItemAccess()
const logger = createLogger('delete todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  try {
    await todoAccess.deleteTodo(todoId, userId);

    return { 
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'deleted' })
    }
  } catch (error) {
    logger.error('error fetching todos', { key: error })
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Error deleting todo'})
    }
  }
}
