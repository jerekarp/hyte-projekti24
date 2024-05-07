import express from 'express';
import {chatgptMiddleware} from '../middlewares/chatgpt.mjs'; // Tarkista tiedostopolku
import {authenticateToken} from '../middlewares/authentication.mjs';

const router = express.Router();

/**
 * @api {post} zenbot Send message to GPT-3.5 model for completion.
 * @apiDescription You'll need an OpenAI API key for the bearer token. You'll need to create the API key yourself if you want to test this functionality anywhere other than on a published website (e.g., Postman).
 * @apiVersion 1.0.0
 * @apiName ChatCompletion
 * @apiGroup Chat
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type application/json.
 *
 * @apiParam {String} model Model name (e.g., "gpt-3.5-turbo").
 * @apiParam {Object[]} messages Array of messages.
 * @apiParam {String} messages.role Role of the message sender ("user" or "assistant").
 * @apiParam {String} messages.content Content of the message.
 *
 * @apiSuccess {String} id Id of the chat completion.
 * @apiSuccess {String} object Type of the object.
 * @apiSuccess {Number} created Timestamp of creation.
 * @apiSuccess {String} model Name of the model used for completion.
 * @apiSuccess {Object[]} choices Array of completion choices.
 * @apiSuccess {Number} choices.index Index of the choice.
 * @apiSuccess {Object} choices.message Completed message object.
 * @apiSuccess {String} choices.message.role Role of the message sender ("user" or "assistant").
 * @apiSuccess {String} choices.message.content Content of the completed message.
 * @apiSuccess {Object} choices.logprobs Log probabilities.
 * @apiSuccess {String} choices.finish_reason Reason for finishing.
 * @apiSuccess {Object} usage Token usage information.
 * @apiSuccess {Number} usage.prompt_tokens Number of tokens in the prompt.
 * @apiSuccess {Number} usage.completion_tokens Number of tokens in the completion.
 * @apiSuccess {Number} usage.total_tokens Total number of tokens used.
 * @apiSuccess {String} system_fingerprint System fingerprint.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "model": "gpt-3.5-turbo",
 *         "messages": [
 *             {
 *                 "role": "user",
 *                 "content": "Hei, mitä kuuluu?"
 *             }
 *         ]
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "chatcmpl-9KMredx8b6O06yudpXLWrGipUasO4",
 *         "object": "chat.completion",
 *         "created": 1714643478,
 *         "model": "gpt-3.5-turbo-0125",
 *         "choices": [
 *             {
 *                 "index": 0,
 *                 "message": {
 *                     "role": "assistant",
 *                     "content": "Hei! Kiitos kysymästä, minulle kuuluu hyvää. Entä sinulle?"
 *                 },
 *                 "logprobs": null,
 *                 "finish_reason": "stop"
 *             }
 *         ],
 *         "usage": {
 *             "prompt_tokens": 16,
 *             "completion_tokens": 26,
 *             "total_tokens": 42
 *         },
 *         "system_fingerprint": "fp_3b926dz36b"
 *     }
 *
 * @apiUse InvalidTokenError
 */


router.post('/zenbot', authenticateToken, chatgptMiddleware);

export default router;