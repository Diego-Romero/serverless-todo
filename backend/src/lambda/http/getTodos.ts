import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess';
import { getUserId } from '../utils';
const todosAccess = new TodoItemAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserId(event)
    const allTodos = await todosAccess.getTodos(userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: allTodos
      })
    }

  } catch(e) {
    console.log(e)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'unable to fetch todos' 
      })
    }
  }
}
