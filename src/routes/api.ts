import { Router } from "express";
import LocationController from "../controllers/API/LocationController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

router.use(authenticate());

router.get('/v1/locations', authorize(['Locations.Read', 'Locations.ReadWrite']), LocationController.index);
router.get('/v1/locations/:id', authorize(['Locations.Read', 'Locations.ReadWrite']), LocationController.show);
router.post('/v1/locations', authorize(['Locations.ReadWrite']), LocationController.store);
router.patch('/v1/locations/:id', authorize(['Locations.ReadWrite']), LocationController.update);
router.put('/v1/locations/:id', authorize(['Locations.ReadWrite']), LocationController.replace);
router.delete('/v1/locations/:id', authorize(['Locations.ReadWrite']), LocationController.delete);

export default router;