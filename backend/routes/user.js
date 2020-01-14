var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    role: "user"
  });
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
 *    user:
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
 * /user:
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
 * /user/{userId}:
 *    get:
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: valide user found
 *        400:
 *          description: invalid request
 *      summary: Return a user by ID.
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          type: integer
 *       
 */