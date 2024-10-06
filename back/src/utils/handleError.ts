import { HttpException, HttpStatus } from '@nestjs/common';
import { UNKNOWN_ERROR } from 'src/errors/error.consts';

export const handleError = (
  message: string,
  status: HttpStatus,
): HttpException => {
  throw new HttpException({ statusCode: status, message: [message] }, status);
};

export const handleManyErrors = (
  error: any,
  notFoundMessage?: string,
  dupcicateMessage?: string,
) => {
  if (error === 'notFound' && notFoundMessage) {
    handleError(notFoundMessage, HttpStatus.BAD_REQUEST);
  } else if (error.code === 11000 && dupcicateMessage) {
    handleError(dupcicateMessage, HttpStatus.BAD_REQUEST);
  } else {
    handleError(UNKNOWN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
