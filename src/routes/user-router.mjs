import express from 'express';
import {body, param} from 'express-validator';
import {
  getUserById,
  getUsers,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';
const userRouter = express.Router();

userRouter
.route('/')
/**
 * @api {get} users Request user list
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Array} users Array of users.
 * @apiSuccess {Object} user User object.
 * @apiSuccess {Number} user.user_id Id of the user.
 * @apiSuccess {String} user.username Username of the user.
 * @apiSuccess {String} user.user_level User level of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        {
 *            "user_id": 1,
 *            "username": "janedoe",
 *            "user_level": "admin"
 *        },
 *        {
 *            "user_id": 2,
 *            "username": "mike_smith",
 *            "user_level": "moderator"
 *        },
 *        {
 *            "user_id": 10,
 *            "username": "vee",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 11,
 *            "username": "kissa12345",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 15,
 *            "username": "jere27",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 16,
 *            "username": "jere28",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 17,
 *            "username": "jere29",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 18,
 *            "username": "jere32v2",
 *            "user_level": "admin"
 *        },
 *        {
 *            "user_id": 21,
 *            "username": "jere31",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 22,
 *            "username": "jere32",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 25,
 *            "username": "pizza",
 *            "user_level": "regular"
 *        },
 *        {
 *            "user_id": 26,
 *            "username": "kissa66666",
 *            "user_level": "regular"
 *        }
 *     ]
 *
 * @apiUse InvalidTokenError
 */
.get(authenticateToken, getUsers)
// update user
/**
 * @api {put} users Update user's own data
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {String} username New username for the user.
 * @apiParam {String} password New password for the user.
 * @apiParam {String} email New email for the user.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} user_id Id of the updated user.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "testuser",
 *       "password": "testpassword55",
 *       "email": "test@example.com"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "user data updated",
 *        "user_id": 17
 *     }
 *
 * @apiUse InvalidTokenError
 */
.put(
  authenticateToken,
  body('username', 'username must be 3-20 characters long and alphanumeric')
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric(),
  body('password', 'minimum password length is 8 characters')
    .trim()
    .isLength({min: 8, max: 128}),
  body('email', 'must be a valid email address')
    .trim()
    .isEmail()
    .normalizeEmail(),
  validationErrorHandler,
  putUser,
)
// user registration
/**
 * @api {post} users Create user
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {String} username Username for the new user.
 * @apiParam {String} password Password for the new user.
 * @apiParam {String} email Email for the new user.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} user_id Id of the newly created user.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username": "testuser",
 *        "password": "testpassword55",
 *        "email": "test55@example.com"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "new user created",
 *        "user_id": 54
 *     }
 */
.post(
  body('username', 'username must be 3-20 characters long and alphanumeric')
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric(),
  body('password', 'minimum password length is 8 characters')
    .trim()
    .isLength({min: 8, max: 128}),
  body('email', 'must be a valid email address')
    .trim()
    .isEmail()
    .normalizeEmail(),
  validationErrorHandler,
  postUser,
);

// /user/:id endpoint
userRouter
.route('/:id')
// get info of a user
/**
 * @api {get} users/:id Get user by id
 * @apiVersion 1.0.0
 * @apiName GetUserById
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Number} user_id Id of the user.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {String} email Email of the user.
 * @apiSuccess {String} created_at User creation time.
 * @apiSuccess {String} user_level User level of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "user_id": 1,
 *        "username": "janedoe",
 *        "email": "janedoe@example.com",
 *        "created_at": "2024-02-05T08:40:48.000Z",
 *        "user_level": "admin"
 *     }
 *
 * @apiUse InvalidTokenError
 */
.get(
  authenticateToken,
  param('id', 'must be integer').isInt(),
  validationErrorHandler,
  getUserById,
)
// delete user based on id
/**
 * @api {delete} users/:id Delete user
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} user_id Id of the deleted user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "user deleted",
 *        "user_id": "56"
 *     }
 *
 * @apiUse InvalidTokenError
 */
.delete(
  authenticateToken,
  param('id', 'must be integer').isInt(),
  validationErrorHandler,
  deleteUser,
);

export default userRouter;
