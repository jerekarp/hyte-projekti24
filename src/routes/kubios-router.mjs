import express from 'express';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {getUserData, getUserInfo, getFilteredData} from '../controllers/kubios-controller.mjs';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, getUserData)
  /**
   * @api {get} kubios/user-data Get User Data
   * @apiName GetUserData
   * @apiGroup Kubios
   * @apiPermission token
   *
   * @apiDescription Returns user's heart rate analysis data.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiSuccess {Object[]} results List of heart rate analysis results.
   * @apiSuccess {String} results.create_timestamp Timestamp when the data was created.
   * @apiSuccess {String} results.daily_result Daily result timestamp (null if not available).
   * @apiSuccess {String} results.measure_id ID of the measurement.
   * @apiSuccess {String} results.measured_timestamp Timestamp when the measurement was taken.
   * @apiSuccess {Object} results.result Heart rate analysis result.
   * @apiSuccess {Number} results.result.artefact Artefact value.
   * @apiSuccess {String} results.result.artefact_level Artefact level.
   * @apiSuccess {Object} results.result.freq_domain Frequency domain data.
   * @apiSuccess {Number} results.result.freq_domain.HF_peak HF peak value.
   * @apiSuccess {Number} results.result.freq_domain.HF_power HF power value.
   * @apiSuccess {Number} results.result.freq_domain.HF_power_nu HF power nu value.
   * @apiSuccess {Number} results.result.freq_domain.HF_power_prc HF power percentage value.
   * @apiSuccess {Number} results.result.freq_domain.LF_HF_power LF/HF power value.
   * @apiSuccess {Number} results.result.freq_domain.LF_peak LF peak value.
   * @apiSuccess {Number} results.result.freq_domain.LF_power LF power value.
   * @apiSuccess {Number} results.result.freq_domain.LF_power_nu LF power nu value.
   * @apiSuccess {Number} results.result.freq_domain.LF_power_prc LF power percentage value.
   * @apiSuccess {Number} results.result.freq_domain.VLF_peak VLF peak value.
   * @apiSuccess {Number} results.result.freq_domain.VLF_power VLF power value.
   * @apiSuccess {Number} results.result.freq_domain.VLF_power_prc VLF power percentage value.
   * @apiSuccess {Number} results.result.freq_domain.tot_power Total power value.
   * @apiSuccess {Number} results.result.mean_hr_bpm Mean heart rate in beats per minute.
   * @apiSuccess {Number} results.result.mean_rr_ms Mean RR interval in milliseconds.
   * @apiSuccess {Number} results.result.pns_index PNS index value.
   * @apiSuccess {Number} results.result.readiness Readiness value.
   * @apiSuccess {Number} results.result.recovery Recovery value.
   * @apiSuccess {Number} results.result.respiratory_rate Respiratory rate value.
   * @apiSuccess {Number} results.result.rmssd_ms RMSSD value in milliseconds.
   * @apiSuccess {Number} results.result.sd1_ms SD1 value in milliseconds.
   * @apiSuccess {Number} results.result.sd2_ms SD2 value in milliseconds.
   * @apiSuccess {Number} results.result.sdnn_ms SDNN value in milliseconds.
   * @apiSuccess {Number} results.result.sns_index SNS index value.
   * @apiSuccess {Number} results.result.stress_index Stress index value.
   * @apiSuccess {Number} [results.user_happiness] User happiness level (optional).
   * @apiSuccess {String} status Status of the request.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "results": [
   *         {
   *           "create_timestamp": "2024-04-05T07:09:18.215128+00:00",
   *           "daily_result": "2024-04-05",
   *           "measure_id": "201ac318-8110-4a74-b835-007649b4edd8",
   *           "measured_timestamp": "2024-04-05T10:02:47+03:00",
   *           "result": {
   *             "artefact": 0.25393821742984085,
   *             "artefact_level": "GOOD",
   *             "freq_domain": {
   *               "HF_peak": 0.15,
   *               "HF_power": 1074.755152007626,
   *               "HF_power_nu": 22.453249500418448,
   *               "HF_power_prc": 21.74353911638314,
   *               "LF_HF_power": 3.452255858231375,
   *               "LF_peak": 0.08666666666666667,
   *               "LF_power": 3710.329769682679,
   *               "LF_power_nu": 77.51436212415028,
   *               "LF_power_prc": 75.06426029321675,
   *               "VLF_peak": 0.04,
   *               "VLF_power": 156.23605305202875,
   *               "VLF_power_prc": 3.160835958385798,
   *               "tot_power": 4942.871288132797
   *             },
   *             "mean_hr_bpm": 64.27301349080766,
   *             "mean_rr_ms": 933.5177664974619,
   *             "pns_index": 0.6014629577475618,
   *             "readiness": 69.40750711342228,
   *             "recovery": 69.40750711342228,
   *             "respiratory_rate": 12.22,
   *             "rmssd_ms": 62.97129511561593,
   *             "sd1_ms": 44.58442461685107,
   *             "sd2_ms": 92.16928496839458,
   *             "sdnn_ms": 72.40598321638754,
   *             "sns_index": -0.682429796259225,
   *             "stress_index": 5.514309990514939
   *           }
   *         },
   *         {
   *           "create_timestamp": "2024-04-08T07:38:41.414695+00:00",
   *           "daily_result": null,
   *           ...
   *         }
   *       ],
   *       "status": "ok"
   *     }
   * 
   * @apiUse InvalidTokenError
   */
  .get('/user-info', authenticateToken, getUserInfo)
  /**
   * @api {get} kubios/user-info Get User Info
   * @apiName GetUserInfo
   * @apiGroup Kubios
   * @apiPermission token
   *
   * @apiDescription Returns user's information.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiSuccess {String} status Status of the request.
   * @apiSuccess {Object} user User information.
   * @apiSuccess {String} user.email User's email address.
   * @apiSuccess {String} user.family_name User's family name.
   * @apiSuccess {String} user.given_name User's given name.
   * @apiSuccess {String} user.sub User's unique identifier.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "user": {
   *         "email": "jussi.esimerkki@gmail.com",
   *         "family_name": "Esimerkki",
   *         "given_name": "Jussi",
   *         "sub": "aa5s1eac-2ab9-4431-a784-8215asd0905c5"
   *       }
   *     }
   * 
   * @apiUse InvalidTokenError
   */
  .get('/filtered-data', authenticateToken, getFilteredData);
  /**
   * @api {get} kubios/filtered-data Get Filtered Data
   * @apiName GetFilteredData
   * @apiGroup Kubios
   * @apiPermission token
   *
   * @apiDescription Returns filtered data along with data count and maximum values.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiSuccess {String} status Status of the request.
   * @apiSuccess {Number} dataCount Count of data entries.
   * @apiSuccess {Object[]} filteredData Array of filtered data entries.
   * @apiSuccess {String} filteredData.measured_timestamp Timestamp when the data was measured.
   * @apiSuccess {Number} filteredData.stress_index Stress index value.
   * @apiSuccess {Number} filteredData.respiratory_rate Respiratory rate value.
   * @apiSuccess {Number} filteredData.mean_hr_bpm Mean heart rate value.
   * @apiSuccess {Number} filteredData.readiness Readiness value.
   * @apiSuccess {Object} maxValues Maximum values among the filtered data.
   * @apiSuccess {Number} maxValues.stress_index Maximum stress index value.
   * @apiSuccess {Number} maxValues.respiratory_rate Maximum respiratory rate value.
   * @apiSuccess {Number} maxValues.mean_hr_bpm Maximum mean heart rate value.
   * @apiSuccess {Number} maxValues.readiness Maximum readiness value.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "dataCount": 21,
   *       "filteredData": [
   *         {
   *           "measured_timestamp": "2024-02-28T16:39:27+02:00",
   *           "stress_index": 4.845037608430292,
   *           "respiratory_rate": 9.12,
   *           "mean_hr_bpm": 77.50351608158914,
   *           "readiness": 62.5
   *         },
   *         {
   *           "measured_timestamp": "2024-02-29T20:19:54+02:00",
   *           "stress_index": 8.359343486525,
   *           "respiratory_rate": 11.66,
   *           "mean_hr_bpm": 70.63488097023006,
   *           "readiness": 62.5
   *         },
   *         {
   *           "measured_timestamp": "2024-04-30T10:27:42+03:00",
   *           "stress_index": 5.056704122184593,
   *           "respiratory_rate": 11.16,
   *           "mean_hr_bpm": 61.05924516614309,
   *           "readiness": 70.681886577708
   *         }
   *       ],
   *       "maxValues": {
   *         "stress_index": 8.592446387704035,
   *         "respiratory_rate": 19.24,
   *         "mean_hr_bpm": 77.50351608158914,
   *         "readiness": 91.81907338355305
   *       }
   *     }
   * 
   * @apiUse InvalidTokenError
   */


export default kubiosRouter;
