import { HttpException } from '@nestjs/common';

export const handleError = (error: any) => {
  const message = error.response?.message || error.message;
  const code = error.response?.statusCode || 500;
  throw new HttpException(message, code);
};

export const successMessage = (data: object, code = 200) => {
  return {
    statusCode: code,
    message: 'success',
    data,
  };
};
