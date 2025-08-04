import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  getTest(params): string {
    console.log(params.id);
    if (!params.id || !Number.isInteger(params.id)) {
      throw new HttpException(
        'Bad Request: id必须是整数',
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'Hello World!';
  }
}
