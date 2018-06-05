import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthenticationService } from '../services/authentication.service';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { toUserDto } from '../../user';
// import * as csurf from 'csurf';

@Controller('auth')
@ApiUseTags('authentication')
export class AuthenticationController {

  constructor(private _authenticationService: AuthenticationService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  public async login(@Req() request, @Res() response, @Body(new ValidationPipe()) credentials: LoginDto) {

    const user = toUserDto(request.user);
    const token = this._authenticationService.createToken(user);
    const tokenExpiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;

    return response
    .cookie('TOKEN', token, {
    //      maxAge: 1900000,
      httpOnly: true,
    //    secure: true,
    })
    //      .cookie('XSRF-TOKEN', request.csrfToken())
    .status(HttpStatus.OK)
    .send({ user, tokenExpiresIn });
  }

  @Post('signup')
  // @UsePipes()
  public async register(@Res() response, @Body(/*new ValidationPipe()*/) registerDto: RegisterDto) {
    // console.log(JSON.stringify(request.csrfToken()));
    // csurf({ cookie: true });

    const user = await this._authenticationService.register(registerDto.firstName, registerDto.lastName, registerDto.email, registerDto.password);

    console.log(user);

    const token = this._authenticationService.createToken(user);
    const tokenExpiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;
    return response
      .cookie('_token', token, { maxAge: 900000, httpOnly: true, secure: true })
      .cookie('TOKEN', token, { /*maxAge: 900000,*/ httpOnly: true })
      .status(HttpStatus.CREATED)
      .send({ user, tokenExpiresIn });
  }

  @Post('signout')
  public async signout() {

  }

  @Post('forgot')
  public async forgot() {

  }

@Post('reset')
  public async reset() {

  }

@Post('microsoft')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  public async microsoftLogin(@Req() request) {
//    console.log('user', request.user);
  }
}
