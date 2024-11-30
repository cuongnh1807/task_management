import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { UserRepository } from '../../database/repositories';

@Injectable()
export class RegisterUserValidatePipe implements PipeTransform<any> {
  constructor(private userRepository: UserRepository) {}
  async transform(value: RegisterDto) {
    const existedUser = await this.userRepository.findOneBy({
      username: value.username,
    });
    if (existedUser) {
      throw new BadRequestException('The username existed');
    }
    return value;
  }
}
