import {
  Controller,
  Get,
  HttpStatus,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RegisterDto } from '../dtos';
import { RegisterUserValidatePipe } from '../validations';

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Request() req: any): Promise<any> {
    const user = await this.authService.loginWithGoogleOauth(req?.user);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Post('/sign-up')
  async signUpUser(@Body(RegisterUserValidatePipe) data: RegisterDto) {
    const user = await this.authService.signUp(data);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Post('/sign-in')
  async signInUser(@Body() data: LoginDto) {
    const user = await this.authService.signIn(data);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
