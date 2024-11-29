import { UserRepository } from '@/database/repositories';
import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateProfileDto } from '@/api/dtos/profile.dto';

@Injectable()
export class UpdateProfileValidatePipe implements PipeTransform<any> {
  constructor(
    @Inject('REQUEST')
    private request: any,
    private userRepository: UserRepository,
  ) {}
  async transform(value: UpdateProfileDto) {
    if (!Object.keys(value).length) {
      throw new BadRequestException('Nothing to change');
    }
    if (value.username) {
      const user = await this.userRepository.findOneBy({
        username: value.username,
      });
      if (user.id === this.request.user.sub) {
        throw new BadRequestException('Username existed');
      }
    }

    if (value.email) {
      const userEmail = await this.userRepository.findOneBy({
        email: value.email,
      });
      if (userEmail.id === this.request.user.sub) {
        throw new BadRequestException('Email existed');
      }
    }
    return value;
  }
}
