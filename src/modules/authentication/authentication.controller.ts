import { AuthenticationService } from './authentication.service';
import { Controller, Get, Post, Res, Req, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
// import * as csurf from 'csurf';

@ApiUseTags('authentication')
@Controller('auth')
export class AuthenticationController {

  constructor(private authService: AuthenticationService) {}

  @Post('signin')
  public async login(@Res() response, @Body() credentials: LoginDto) {
    const user = await this.authService.login(credentials);
    const token = this.authService.createToken(user);
    const tokenExpiresIn = JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii')).exp;

    return response
    .cookie('TOKEN', token, {
      maxAge: 1900000,
      httpOnly: true,
  //    secure: true,
    })
//      .cookie('XSRF-TOKEN', request.csrfToken())
    .status(HttpStatus.OK)
    .send({ user, tokenExpiresIn });
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
      .cookie('TOKEN', token, { maxAge: 900000, httpOnly: true })
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

}

/**
 *
 *
 *
  var users = require('../controllers/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset').post(users.reset);

  app.route('/api/auth/signup').post(users.signup)
  app.route('/api/auth/signin').post(passport.authenticate('local'), users.signin)
  app.route('/api/auth/signout').post(users.signout)

  // Jwt token
  app.route('/api/auth/token').post(users.token)
  // Jwt protected route example:
  // app.route('/api/auth/secretPlace').get(passport.authenticate('jwt'), (req, res) => {
  //   console.log(req.user)
  //   console.log(req.isAuthenticated())
  //   res.status(200).send()
  // })

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall)
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback)
 *
 *
 *
 *
 */
