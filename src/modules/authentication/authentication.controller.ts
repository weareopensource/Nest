import { AuthenticationService } from './authentication.service';
import { Controller, Get, Post, Res, Req, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
import { AuthGuard } from '@nestjs/passport';
// import * as csurf from 'csurf';

@ApiUseTags('authentication')
@Controller('auth')
export class AuthenticationController {

  constructor(private authService: AuthenticationService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  public async login(@Req() request, @Res() response) {
    const token = this.authService.createToken(request.user);
    const tokenExpiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;

    return response
    .cookie('TOKEN', token, {
//      maxAge: 1900000,
      httpOnly: true,
  //    secure: true,
    })
//      .cookie('XSRF-TOKEN', request.csrfToken())
    .status(HttpStatus.OK)
    .send({ user: request.user, tokenExpiresIn });
  }

  @Post('signup')
  public async register(@Res() response, @Req() request, @Body() user: RegisterDto) {
    // console.log(JSON.stringify(request.csrfToken()));
    // csurf({ cookie: true });
    const registeredUser = await this.authService.register(user).catch(console.log);
    const token = this.authService.createToken(registeredUser);
    const tokenExpiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;
    return response
//      .cookie('_token', token, { maxAge: 900000, httpOnly: true, secure: true })
      .cookie('TOKEN', token, { /*maxAge: 900000,*/ httpOnly: true })
      .status(HttpStatus.CREATED)
      .send({ user: registeredUser, tokenExpiresIn });
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
    console.log('user', request.user);
  }
}
