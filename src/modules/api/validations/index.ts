import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { UserRepository } from '@/database/repositories';

@Injectable()
export class RegisterUserValidatePipe implements PipeTransform<any> {
  constructor(private userRepository: UserRepository) {}
  async transform(value: RegisterDto) {
    const existedUser = await this.userRepository.findOneBy({
      email: value.email,
    });
    if (!existedUser) {
      throw new BadRequestException('The email existed');
    }
    return value;
  }
}
