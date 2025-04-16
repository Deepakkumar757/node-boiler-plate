/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the users
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the users was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the users was last updated
 *       example:
 *         id: "123"
 *         createdAt: "2025-04-11T06:04:03Z"
 *         updatedAt: "2025-04-11T06:04:03Z"
 * 
 * /api/v1/users:
 *   get:
 *     summary: Returns a list of userss
 *     tags: [users]
 *     responses:
 *       200:
 *         description: The list of userss
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/users'
 *   post:
 *     summary: Create a new users
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       201:
 *         description: The created users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 * 
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a users by id
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: The users details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *   put:
 *     summary: Update a users
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       200:
 *         description: The updated users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *   delete:
 *     summary: Delete a users
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       204:
 *         description: users deleted successfully
 */