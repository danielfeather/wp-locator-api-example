import { Router } from "express";
import LocationController from "../controllers/API/LocationController";

const router = Router();

router.get('/v1/locations', LocationController.index);
router.get('/v1/locations/:id', LocationController.show);
router.post('/v1/locations', LocationController.store);
router.patch('/v1/locations/:id', LocationController.update);
router.put('/v1/locations/:id', LocationController.replace);
router.delete('/v1/locations/:id', LocationController.delete);

export default router;