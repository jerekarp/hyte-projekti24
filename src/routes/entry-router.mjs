import express from 'express';
import {body, param} from 'express-validator';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entry-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';

const entryRouter = express.Router();

/**
 * @api {get} entries Get all entries for a logged in user
 * @apiVersion 1.0.0
 * @apiName GetEntries
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} entries List of entries.
 * @apiSuccess {Number} entries.entry_id Id of the entry.
 * @apiSuccess {Number} entries.user_id Id of the user who created the entry.
 * @apiSuccess {Date} entries.entry_date Date of the entry.
 * @apiSuccess {String} entries.mood Mood of the user on that day.
 * @apiSuccess {Number} entries.weight Weight of the user on that day.
 * @apiSuccess {Number} entries.sleep_hours Hours of sleep of the user on that day.
 * @apiSuccess {String} entries.notes Additional notes by the user.
 * @apiSuccess {Date} entries.created_at Timestamp of when the entry was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        {
 *            "entry_id": 19,
 *            "user_id": 17,
 *            "entry_date": "2024-03-06T22:00:00.000Z",
 *            "mood": "Happy",
 *            "weight": "79.00",
 *            "sleep_hours": 7,
 *            "notes": "This was a good day",
 *            "created_at": "2024-03-07T12:44:45.000Z"
 *        }
 *     ]
 *
 * @apiError UnauthorizedError Invalid token provided.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */

/**
 * @api {post} entries Create a new entry for a logged in user
 * @apiVersion 1.0.0
 * @apiName PostEntry
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {String} entry_date Date of the entry (format: "YYYY-MM-DD").
 * @apiParam {String} mood Mood of the user on that day.
 * @apiParam {Number} weight Weight of the user on that day.
 * @apiParam {Number} sleep_hours Hours of sleep of the user on that day.
 * @apiParam {String} [notes] Additional notes by the user.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "entry_date": "2024-02-12",
 *       "mood": "Happy",
 *       "weight": 69.6,
 *       "sleep_hours": 7,
 *       "notes": "This was a good day"
 *     }
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} entry_id Id of the newly created entry.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *        "message": "New entry added.",
 *        "entry_id": 38
 *     }
 *
 * @apiError UnauthorizedError Invalid token provided.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */

entryRouter
  .route('/')
  .get(authenticateToken, getEntries)
  .post(
    authenticateToken,
    body('entry_date').isDate(),
    body('mood').optional().trim().isLength({min: 3, max: 20}).isString(),
    body('weight').optional().isFloat({min: 30, max: 200}),
    body('sleep_hours').optional().isInt({min: 0, max: 24}),
    body('notes').optional().isString().isLength({min: 3, max: 300}),
    validationErrorHandler,
    postEntry,
  );

  /**
 * @api {get} entries/:id Get a specific entry for a logged in user
 * @apiVersion 1.0.0
 * @apiName GetEntryById
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Id of the entry.
 *
 * @apiSuccess {Number} entry_id Id of the entry.
 * @apiSuccess {Number} user_id Id of the user who created the entry.
 * @apiSuccess {Date} entry_date Date of the entry.
 * @apiSuccess {String} mood Mood of the user on that day.
 * @apiSuccess {Number} weight Weight of the user on that day.
 * @apiSuccess {Number} sleep_hours Hours of sleep of the user on that day.
 * @apiSuccess {String} notes Additional notes by the user.
 * @apiSuccess {Date} created_at Timestamp of when the entry was created.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "entry_id": 38,
 *        "user_id": 17,
 *        "entry_date": "2024-03-15T22:00:00.000Z",
 *        "mood": "Happy",
 *        "weight": "70.00",
 *        "sleep_hours": 7,
 *        "notes": "This was a good day",
 *        "created_at": "2024-03-15T22:17:25.000Z"
 *     }
 *
 * @apiError UnauthorizedError Invalid token provided.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */

  /**
 * @api {put} entries/:id Update an entry for a logged in user
 * @apiVersion 1.0.0
 * @apiName UpdateEntry
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Id of the entry to be updated.
 * @apiParam {String} [entry_date] New date of the entry (format: "YYYY-MM-DD").
 * @apiParam {String} [mood] New mood of the user on that day.
 * @apiParam {Number} [weight] New weight of the user on that day.
 * @apiParam {Number} [sleep_hours] New hours of sleep of the user on that day.
 * @apiParam {String} [notes] New additional notes by the user.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "entry_date": "2024-02-12",
 *       "mood": "Even more happy now",
 *       "weight": 69.6,
 *       "sleep_hours": 7,
 *       "notes": "This was a good day"
 *     }
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} entry_id Id of the updated entry.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "Entry data updated",
 *        "entry_id": "38"
 *     }
 *
 * @apiError UnauthorizedError Invalid token provided.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */

  /**
 * @api {delete} entries/:id Delete an entry for a logged in user
 * @apiVersion 1.0.0
 * @apiName DeleteEntry
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Id of the entry to be deleted.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Number} entry_id Id of the deleted entry.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "Entry deleted",
 *        "entry_id": "38"
 *     }
 *
 * @apiError UnauthorizedError Invalid token provided.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */


entryRouter
  .route('/:id')
  .get(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    validationErrorHandler,
    getEntryById,
  )
  .put(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    // user_id is not allowed to be changed
    body('user_id', 'not allowed').not().exists(),
    body('entry_date').optional().isDate(),
    body('mood').optional().trim().isLength({min: 3, max: 20}).isString(),
    body('weight').optional().isFloat({min: 30, max: 200}),
    body('sleep_hours').optional().isInt({min: 0, max: 24}),
    body('notes').optional().isString().isLength({min: 3, max: 300}),
    validationErrorHandler,
    putEntry,
  )
  .delete(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    validationErrorHandler,
    deleteEntry,
  );

export default entryRouter;
