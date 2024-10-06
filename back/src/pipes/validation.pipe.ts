import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from './validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.reduce((acc, err, idx, arr) => {
        return (
          acc +
          `${Object.values(err.constraints).join(', ')}${
            idx === arr.length - 1 ? '' : ', '
          }`
        );
      }, '');
      throw new ValidationException(messages);
    }

    return value;
  }
}
