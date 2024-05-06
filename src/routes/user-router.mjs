import express from 'express';
import {body, param} from 'express-validator';
import {
  getUserById,
  postUser,
  getStudentInfo,
  putStudentInfo,
  postStudentInfo
} from '../controllers/user-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';
const userRouter = express.Router();

userRouter
.route('/')
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
);

// /users/info endpoint

userRouter
  .route('/info')
// add basic information about the user
/**
 * @api {post} users Add information about the user
 * @apiVersion 1.0.0
 * @apiName AddUserInformation
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {Number} user_id
 * @apiParam {String} first_name
 * @apiParam {String} surname
 * @apiParam {Number} student_number
 * @apiParam {Number} weight
 * @apiParam {Number} height
 * @apiParam {Number} age
 * @apiParam {String} gender
 *
 * @apiSuccess {String} message Confirmation message.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "first_name": "test",
 *       "surname": "testinen",
 *       "student_number": 123456,
 *       "weight": 70,
 *       "height": 180,
 *       "age": 20,
 *       "gender": "male"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "Student infromation added succesfully",
 *     }
 *
 * @apiUse InvalidTokenError
 */

  .post(
    authenticateToken,
    body('user_id', 'User ID must be provided and be an integer').isInt(),
    body('first_name', 'First name is required').not().isEmpty(),
    body('surname', 'Surname is required').not().isEmpty(),
    body('student_number', 'Student number is required').not().isEmpty(),
    body('weight', 'Weight must be a valid number').isFloat(),
    body('height', 'Height must be a valid number').isFloat(),
    body('age', 'Age must be a valid integer').isInt(),
    body('gender', 'Gender is required').not().isEmpty(),
    validationErrorHandler,
    postStudentInfo
  );


  userRouter
  .route('/info/:user_id')
  // check if the user has basic information in database
  /**
 * @api {get} users Check if the users information is found in database
 * @apiVersion 1.0.0
 * @apiName GetUserInformation
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {Number} user_id
 *
 * @apiSuccess {String} message Confirmation message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": "No student information found for this user_id",
 *      "found": false
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          "message": "Student information exists for this user_id",
          "found": true,
          "studentInfo": {
              "user_id": 1,
              "student_id": 1,
              "first_name": "test",
              "surname": "testinen",
              "student_number": 123456,
              "weight": 70,
              "height": 180,
              "age": 20,
              "gender": "male",
              "stress_level": null"
            }
          }

 * @apiUse InvalidTokenError
 */

  .get(
    authenticateToken,
    param('user_id', 'User ID must be provided and be an integer').isInt(),
    validationErrorHandler,
    getStudentInfo
  )

// update basic information about the user
/**
 * @api {put} users Update users basic information
 * @apiVersion 1.0.0
 * @apiName UpdateUserInformation
 * @apiGroup Users
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {Number} user_id
 * @apiParam {String} first_name
 * @apiParam {String} surname
 * @apiParam {Number} student_number
 * @apiParam {Number} weight
 * @apiParam {Number} height
 * @apiParam {Number} age
 * @apiParam {String} gender
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} user_id Id of the updated user.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "first_name": "test",
 *       "surname": "testinen",
 *       "student_number": 123456,
 *       "weight": 70,
 *       "height": 180,
 *       "age": 20,
 *       "gender": "male"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          "message": "Student information updated succesfully",
        }

 * @apiUse InvalidTokenError
 */

  .put(
    authenticateToken,
    param('user_id', 'User ID must be provided and be an integer').isInt(),
    body('first_name', 'First name is required').not().isEmpty(),
    body('surname', 'Surname is required').not().isEmpty(),
    body('student_number', 'Student number is required').not().isEmpty(),
    body('weight', 'Weight must be a valid number').isFloat(),
    body('height', 'Height must be a valid number').isFloat(),
    body('age', 'Age must be a valid integer').isInt(),
    body('gender', 'Gender is required').not().isEmpty(),
    validationErrorHandler,
    putStudentInfo
  )


export default userRouter;
