import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Error } from './entities/error.entity';
import { ErrorDto } from './dto/error.dto';

@Injectable()
export class ErrorService {

  constructor(@InjectRepository(Error) private readonly errorRepository: Repository<Error>,) {
  }

  async create(errorDto: ErrorDto) {
    const error = this.errorRepository.create(errorDto);
    return this.errorRepository.save(error);
  }

}
