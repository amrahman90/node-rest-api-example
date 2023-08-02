import { Router } from "express";

import {
  createDrumContainer,
  deleteDrumContainer,
  getAllDrumContainer,
  updateDrumContainer,
  getDrumContaineryId,
} from "../controller/drumContainerController";
import { validateRequestSchema } from "../middleware/validate-request-schema";
import { ValidateSchema } from "../schema/validate-schema";
import { DrumContainerSchema } from "../schema/drumcontainer-schema";

const router = Router();
/**
 * @swagger
 * /drumContainer/:
 *   post:
 *     summary: Create a drum container
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrumContainer'
 *     responses:
 *       200:
 *         description: Success message and the created drum container
 *       400:
 *         description: Bad request error message
 */

router.post("/",DrumContainerSchema,validateRequestSchema,createDrumContainer);

/**
 * @swagger
 * /drumContainer/:
 *   get:
 *     summary: Get all drum containers
 *     responses:
 *       200:
 *         description: Success message and the list of drum containers
 */
router.get("/", getAllDrumContainer);
/**
 * @swagger
 * /drumContainer/{id}:
 *   get:
 *     summary: Get a drum container by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drum container to retrieve
 *     responses:
 *       200:
 *         description: Success message and the drum container with the specified ID
 */
router.get("/:id", getDrumContaineryId);
/**
 * @swagger
 * /drumContainer/{id}:
 *   put:
 *     summary: Update a drum container by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drum container to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrumContainer'
 *     responses:
 *       200:
 *         description: Success message and the updated drum container
 *       400:
 *         description: Bad request error message
 */
router.put("/:id", updateDrumContainer);
/**
 * @swagger
 * /drumContainer/{id}:
 *   delete:
 *     summary: Delete a drum container by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drum container to delete
 *     responses:
 *       200:
 *         description: Success message and the deleted drum container
 */
router.delete("/:id", deleteDrumContainer);

export default router;
