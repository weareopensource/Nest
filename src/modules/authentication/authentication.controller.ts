import { AuthenticationService } from './authentication.service';
import { Controller, Get, Post, Res, Req, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
// import * as csurf from 'csurf';

@ApiUseTags('authentication')
@Controller('auth')
export class AuthenticationController {

  constructor(private authService: AuthenticationService) {}

  @Post('signin')
  public async login(
    @Res() response,
    @Body('usernameOrEmail') usernameOrEmail,
    @Body('password') password) {
    return this.authService.login(usernameOrEmail, password)
    .then(({ token, user, tokenExpiresIn }) => response
      .cookie('TOKEN', token, {
        maxAge: 1900000,
        httpOnly: true,
    //    secure: true,
      })
//      .cookie('XSRF-TOKEN', request.csrfToken())
      .status(HttpStatus.OK)
      .send({ user, tokenExpiresIn }));
  }

  @Post('signup')
  public async register(@Res() response, @Req() request, @Body() body) {
    // console.log(JSON.stringify(request.csrfToken()));
    // csurf({ cookie: true });
    const { name, email, password } = body;
    return this.authService.register(name, email, password)
    .then(() => this.authService.createToken(email))
    .then(token => response
//      .cookie('_token', token, { maxAge: 900000, httpOnly: true, secure: true })
      .cookie('_token', token, { maxAge: 900000, httpOnly: true })
      .status(HttpStatus.CREATED)
      .send());
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
