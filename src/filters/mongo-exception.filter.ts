import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.name) {
      case 'DocumentNotFoundError':
        statusCode = HttpStatus.NOT_FOUND;
        break;

      case 'DivergentArrayError':
      case 'MissingSchemaError':
      case 'ValidatorError':
      case 'ValidationError':
      case 'ObjectExpectedError':
      case 'ObjectParameterError':
      case 'OverwriteModelError':
      case 'StrictModeError':
      case 'VersionError':
        statusCode = HttpStatus.BAD_REQUEST;
        break;

      case 'MongooseError':
      case 'CastError':
      case 'DisconnectedError':
      case 'ParallelSaveError':
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(statusCode).json({
      success: false,
      message: exception.message,
    });
  }
}
