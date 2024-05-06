import express from 'express';
import {body} from 'express-validator';
// import {getMe, postLogin} from '../controllers/auth-controller.mjs';
import {getMe, postLogin} from '../controllers/kubios-auth-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @apiDefine UnauthorizedError
 * @apiError UnauthorizedError User name or password invalid.
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "error": 401,
 *      "message": "invalid username or password"
 *    }
 */

/**
 * @apiDefine InvalidTokenError
 * @apiError InvalidToken Authentication token was invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token",
 *       "status": 401
 *     }
 */

authRouter
  /**
   * @api {post} auth/login Login
   * @apiVersion 1.0.0
   * @apiName PostLogin
   * @apiGroup Authentication
   * @apiPermission all
   *
   * @apiDescription Sign in and get an authentication token for the user. **Login with Kubios account.**
   *
   * @apiParam {String} username Username of the user (Kubios)
   * @apiParam {String} password Password of the user (Kubios)
   *
   * @apiParamExample {json} Request-Example:
   *    {
   *      "username": "jussi.esimerkki@gmail.com",
   *      "password": "password,"
   *    }
   *
   * @apiSuccess {String} message Confirmation message.
   * @apiSuccess {String} token Token for the user authentication.
   * @apiSuccess {Object} user User info.
   * @apiSuccess {String} user.email Email of the user.
   * @apiSuccess {String} user.family_name Family name of the user.
   * @apiSuccess {String} user.given_name Given name of the user.
   * @apiSuccess {String} user.sub Sub identifier of the user.
   * @apiSuccess {Number} user_id Id of the user.
   *
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "message": "Logged in successfully with Kubios",
   *      "user": {
   *          "email": "jussi.esimerkki@gmail.com",
   *          "family_name": "Esimerkki",
   *          "given_name": "Jussi",
   *          "sub": "a6as5b1eac-2sb9-4430-a754-8221f9d0915c5"
   *      },
   *      "user_id": 1,
   *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV9.eyJ1c2VyX2lkIjoxLCJrdWJpb3NJZFRva2VuIjoiZXlKcmFXUWlPaUpRVkVSUlVdfhgfg23kxialUyYlhCNVJVOXBjSFZ4T0663EQlBlWGxKTVdoMVdsUXdNVkpWZWtkWFVTdFJQU0lzSW1Gc1p5STZJbEpUTWpVMkluMC5leUpoZEY5b1lYTm9Jam9pU0VoamVWSnBOMHN0VTBwb1pEQTJhRUp1U0MwMFFTSXNJbk4xWWlJNkltRmhOV0l4WldGakxUSmhZamt0TkRRek1DMWhOemcwTFRneU1XWTVaREE1TURWak5TSXNJbVZ0WVdsc1gzWmxjbWxtYVdWa0lqcDBjblZsTENKcGMzTWlPaUpvZEhSd2N6cGNMMXd2WTI5bmJtbDBieTFwWkhBdVpYVXRkMlZ6ZEMweExtRnRZWHB2Ym1GM2N5NWpiMjFjTDJWMUxYZGxjM1F0TVY5MVVXMUJaelExZUhraUxDSmpiMmR1YVhSdk9uVnpaWEp1WVcxbElqb2lZV0UxWWpGbFlXTXRNbUZpT1MwME5ETXdMV0UzT0RRdE9ESXhaamxrTURrd05XTTFJaXdpWjJsMlpXNWZibUZ0WlNJNklrcGxjbVVpTENKaGRXUWlPaUkzTkRVM01YQmthSFZqTjNaMllXczBkR3cwTlhWMGN6aDFPQ0lzSW1WMlpXNTBYMmxrSWpvaVpEWTFNekJoTnpFdFltUmxPQzAwT0RJMUxUZ3dPVEl0TldWak1qTm1PVGRsTmpnd0lpd2lkRzlyWlc1ZmRYTmxJam9pYVdRaUxDSmhkWFJvWDNScGJXVWlPakUzTVRRMk5ERTRPVElzSW1WNGNDSTZNVGN4TkRZME5UUTVNaXdpYVdGMElqb3hOekUwTmpReE9Ea3lMQ0ptWVcxcGJIbGZibUZ0WlNJNklrdGhjbkJ3YVc1bGJpSXNJbVZ0WVdsc0lqb2lhbVZ5WlhBdWEyRnljSEJwYm1WdVFHZHRZV2xzTG1OdmJTSjkuU0UzZmVfd1ViU0g2enQ3dDdWaUlDTUgwQzBlOUEzc2hSdExXeDNBdW0wVUhNUDFiY2lRemc5TjNENkhfb1VWd2FVMG12NFZVNm5PNm9xc0cySUo1NDF5VzA5ZVFncnNjQWZlQ1BudEYyWEFwa1QwV0ZnQ1R1bTZ3ZzQwQTI2Tng4QWpwam5pUDQ1SG5JcGhqT0owaW1sbW9SSnRvWTBQUnQtOUdIdFVudi1NZUVJUVdkNGJoOHc4b29MRUtaMElXbFJLUGUySHlsQjhGSXRhTkpuYTZmcmFJYVNtVzdaQ0U0b0kzTHZmRkM5Mm5TRUUxUXQ5VU5oeGtGZ0hpSEpkOUVyc2NOLXc3cTRRM21uMS1pSU1ub19lejRZcUptbDdWbWRJYm5NQnpWb0EzT1dSVkhrTFE1Y3dmVWI2WnFFemYtZ3VSTm5oNlhTTmp6VUpaenZkd3dBIiwiaWF0IjoxNzE0NjQxODkyLCJleHAiOjE3MTQ2NDU0OTJ9.6VQ40I5
   */
  .post(
    '/login',
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    validationErrorHandler,
    postLogin,
  )
  /**
   * @api {get} auth/me Request information about current user
   * @apiVersion 1.0.0
   * @apiName GetMe
   * @apiGroup Authentication
   * @apiPermission token
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiSuccess {Object} user User info.
   * @apiSuccess {Number} user.user_id Id of the User.
   * @apiSuccess {String} user.username Username of the User.
   * @apiSuccess {String} user.email email of the User.
   * @apiSuccess {Date} user.created_at User creation time.
   * @apiSuccess {String} user.user_level User level of the User.
   * @apiSuccess {Number} user.iat Token creation timestamp.
   * @apiSuccess {Number} user.exp Token expiration timestamp.
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "user": {
   *     "user_id": 18,
   *     "username": "johnjane",
   *     "email": "johnjane@example.com",
   *     "created_at": "2024-03-07T12:45:51.000Z",
   *     "user_level": "regular",
   *     "iat": 1709887124,
   *     "exp": 1709973524
   *   }
   * }
   * @apiUse InvalidTokenError
   */
  .get('/me', authenticateToken, getMe);

export default authRouter;
