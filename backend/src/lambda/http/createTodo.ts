import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { TodoItemAccess } from '../todoAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const todoAccess = new TodoItemAccess()
const bucketName = process.env.TODOS_BUCKET;
const logger = createLogger('create todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  const id = uuid.v4();
  const userId = getUserId(event);
  
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item: fullTodoItem })
    }
  } catch (error) {
    logger.error('error fetching todos', { key: error })
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Error creating todo'})
    }
  }
}