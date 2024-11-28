import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type TGoogleProfile = {
  id: string;
  displayName: string;
  name?: {
    familyName: string;
    givenName: string;
  };
  emails?: {
    value: string;
  }[];
  photos?: {
    value: string;
  }[];
};
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.google.client_id'),
      clientSecret: configService.get<string>('auth.google.secret'),
      callbackURL: configService.get<string>('auth.google.callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: TGoogleProfile,
  ): Promise<TGoogleProfile> {
    return profile;
  }
}
