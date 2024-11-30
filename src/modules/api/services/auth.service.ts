import { UserRepository } from '@/database/repositories';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TGoogleProfile } from '../auth-strategies';
import { UserEntity } from '@/database/entities';
import { LoginDto, RegisterDto } from '../dtos';
import { compare, getHash } from '@/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  loginWithGoogleOauth = async (user: TGoogleProfile) => {
    const whereCondition = { google_id: user.id };
    const existedUser = await this.userRepository.findOne({
      where: whereCondition,
    });
    if (existedUser) {
      return this._createAccessToken(existedUser);
    } else {
      const paritialUser: Partial<UserEntity> = {
        email: user?.emails?.[0].value,
        avatar_url: user?.photos?.[0].value,
        username: `${user?.name?.givenName} ${user?.name?.familyName}`,
      };
      paritialUser['google_id'] = user.id;

      const newUser = await this.userRepository.save(paritialUser);
      return this._createAccessToken(newUser);
    }
  };

  signUp = async (data: RegisterDto) => {
    const hashPassword = getHash(data.password);
    const newUser = await this.userRepository.save({
      ...data,
      password: hashPassword,
    });
    return this._createAccessToken(newUser);
  };

  signIn = async (data: LoginDto) => {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!user.password) {
      throw new BadRequestException('Please sign-in by another method!!');
    }
    if (!compare(data.password, user.password)) {
      throw new BadRequestException('Wrong password');
    }
    return this._createAccessToken(user);
  };

  private async _createAccessToken(user: UserEntity) {
    const payload = {
      email: user?.email,
      username: user?.username,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      subject: user.id,
      expiresIn: this.configService.get<number>(
        'auth.jwt.access_token_lifetime',
      ),
      issuer: user.id,
    });
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
    };
  }
}
