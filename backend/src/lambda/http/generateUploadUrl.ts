import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger';
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.TODOS_BUCKET
const logger = createLogger('upload url')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const uploadUrl =  s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: 300
  })

  logger.info('generating upload url')

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
