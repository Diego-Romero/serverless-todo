import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
const todosAccess = new TodoItemAccess();
const logger = createLogger('get todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserId(event);
    const allTodos = await todosAccess.getTodos(userId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: allTodos
      })
    }

  } catch(e) {
    logger.error('error fetching todos', { key: e })
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'unable to fetch todos' 
      })
    }
  }
}
