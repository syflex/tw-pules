import { Injectable } from '@nestjs/common';
import { IResponse } from './interfaces/response.interface';

@Injectable()
export class AppService {

  getHello(): IResponse {    
    return { status: true, message: 'Filterator Service is alive!!!' };
  }

}
