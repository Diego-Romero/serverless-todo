import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';

export class TodoItemAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  async createTodo(todo: TodoItem ): Promise<TodoItem> {
    console.log('full todo to be created', todo)
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('fetching user todos')
    const todos = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    }).promise()

    return todos!.Items as TodoItem[];
  }
}


  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('creating local db instance')
      return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    return new AWS.DynamoDB.DocumentClient()
  }
