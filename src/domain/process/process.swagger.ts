/**
 * @swagger
 * components:
 *   schemas:
 *     process:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the process
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the process was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the process was last updated
 *       example:
 *         id: "123"
 *         createdAt: "2025-04-11T06:04:03Z"
 *         updatedAt: "2025-04-11T06:04:03Z"
 * 
 * /api/v1/process:
 *   get:
 *     summary: Returns a list of processs
 *     tags: [process]
 *     responses:
 *       200:
 *         description: The list of processs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/process'
 *   post:
 *     summary: Create a new process
 *     tags: [process]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/process'
 *     responses:
 *       201:
 *         description: The created process
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/process'
 * 
 * /api/v1/process/{id}:
 *   get:
 *     summary: Get a process by id
 *     tags: [process]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The process id
 *     responses:
 *       200:
 *         description: The process details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/process'
 *   put:
 *     summary: Update a process
 *     tags: [process]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The process id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/process'
 *     responses:
 *       200:
 *         description: The updated process
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/process'
 *   delete:
 *     summary: Delete a process
 *     tags: [process]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The process id
 *     responses:
 *       204:
 *         description: process deleted successfully
 */