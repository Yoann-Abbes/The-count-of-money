var express = require('express');
var router = express.Router();
const client = require('../config/clientPg')

let query = 'select * from CRYPTO_LIST'
/* GET home page. */
router.get('/', function (req, res, next) {
  client
    .query(query)
    .then(result => {
      res.json({
        role: "anomyme",
        test: result.rows
      })
    })
    .catch(e => console.error(e.stack))
});

module.exports = router;

/**
 * @swagger
 * definition:
 *    success:
 *      properties:
 *        statusCode:
 *          type: integer
 *          format: int32
 *          default: 200
 *        message:
 *          type: string
 *        data:
 *          type: object
 *    error:
 *      properties:
 *        statusCode:
 *          type: integer
 *          format: int32
 *          default: 400
 *        message:
 *          type: string
 *        error:
 *          type: string
 *    crypto_money:
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *          format: email
 *        gender:
 *          type: string
 *          enum:
 *            - "Male"
 *            - "Female"
 *        password:
 *          type: string
 * /crypto_money:
 *    post:
 *        produces:
 *          - application/json
 *        responses:
 *          200:
 *            description: test
 *          400:
 *            description: invalid request
 *    get:
 *        produces:
 *          - application/json
 *        responses:
 *          200:
 *            description: test
 *          400:
 *            description: invalid request
 * /crypto_money/{cryptoMoneyId}:
 *    get:
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: valide crypto money found
 *        400:
 *          description: invalid request
 *      summary: Return a crypto money by ID.
 *      parameters:
 *        - in: path
 *          name: cryptoMoneyId
 *          required: true
 *          type: integer
 *       
 */