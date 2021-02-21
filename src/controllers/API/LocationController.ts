import {NextFunction, Request, Response} from "express";
import * as joi from "joi";
import * as locations from "../../locations.json";
import { deepExtend } from "../../util/extend";

const schema = joi.object({
    id: joi.string().uuid(),
    name: joi.string().regex(/^[a-z\d\s\-]*$/i),
    display_name: joi.string(),
    location: joi.object({
        address: joi.object({
            address_line_1: joi.string().required().max(100),
            address_line_2: joi.string().max(100),
            address_line_3: joi.string().max(100),
            city: joi.string().required().max(20),
            county: joi.string().max(20),
            post_code: joi.string().required().max(7),
            full: joi.string()
        }),
        coordinates: joi.object({
            lat: joi.string().required(),
            long: joi.string().required()
        }).required()
    }),
    opening_hours: joi.object({
        monday: joi.string().required().max(100),
        tuesday: joi.string().required().max(100),
        wednesday: joi.string().required().max(100),
        thursday: joi.string().required().max(100),
        friday: joi.string().required().max(100),
        saturday: joi.string().required().max(100),
        sunday: joi.string().required().max(100)
    }),
    contact_details: joi.object({
        email_address: joi.string().email(),
        phone: joi.string().max(20)
    }),
    created_at: joi.string().isoDate(),
    updated_at: joi.string().isoDate()
});

class LocationController {

    static async index(req: Request, res: Response): Promise<void> {

        try {

            res.json(await joi.array().items(schema).validateAsync(locations))

        } catch (e) {

            res.json(e)

        }

    }

    /**
     * @method Retrieve a specific record using its unique identifier.
     * @param req
     * @param res
     */
    static async show(req: Request, res: Response): Promise<void> {

        try {

            const locationId = await joi.string().uuid().validateAsync(req.params.id)

            const location = locations.find((location) => location.id === locationId)

            res.json(await schema.validateAsync(location));

        } catch (e) {

            res.json(e);

        }

    }

    /**
     * @method
     * @description Create a new location.
     * @param req
     * @param res
     */
    static async store(req: Request, res: Response): Promise<void> {

        const newSchema = schema.keys({
            id: joi.forbidden(),
            create_at: joi.forbidden(),
            updated_at: joi.forbidden()
        })

        try {
            const body = await newSchema.validateAsync(req.body);
            res.json(body);
        } catch (e) {
            if (e.name === 'ValidationError'){
                res.status(400);
            }
            res.json(e.details);
        }

    }

    /**
     * @method
     * @description Update an existing location with the provided properties.
     * @param req
     * @param res
     * @param next
     */
    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {

            // Validate that the provided id exists and is a valid.
            const locationId = await joi.string().uuid().required().validateAsync(req.params.id);

            // Find the existing location.
            const location = locations.find(location => location.id === locationId);

            const updateScheama = joi.object({
                name: joi.string().regex(/^[a-z\d\s\-]*$/i),
                display_name: joi.string(),
                location: joi.object({
                    address: joi.object({
                        address_line_1: joi.string().max(100),
                        address_line_2: joi.string().max(100),
                        address_line_3: joi.string().max(100),
                        city: joi.string().max(20),
                        county: joi.string().max(20),
                        post_code: joi.string().max(7),
                        full: joi.string()
                    }),
                    coordinates: joi.object({
                        lat: joi.string(),
                        long: joi.string()
                    })
                }),
                opening_hours: joi.object({
                    monday: joi.string().max(100),
                    tuesday: joi.string().max(100),
                    wednesday: joi.string().max(100),
                    thursday: joi.string().max(100),
                    friday: joi.string().max(100),
                    saturday: joi.string().max(100),
                    sunday: joi.string().max(100)
                }),
                contact_details: joi.object({
                    email_address: joi.string().email(),
                    phone: joi.string().max(20)
                })
            });

            try {

                const newProperties = await updateScheama.validateAsync(req.body);

                // Add the properties to the object in the datastore.

                // Return the updated location.
                const mergedLocation = deepExtend(location, newProperties)

                res.json(mergedLocation);
                return;

            } catch (e) {
                if (e.name === 'ValidationError'){
                    res.status(422);
                    res.end();
                    return;
                }
                next(e)
                return;
            }

        } catch (e) {
            if (e.number === 'ValidationError'){
                res.status(422);
                res.end();
                return;
            }
            next(e);
            return;
        }


    }

    /**
     * @method
     * @description Replace an existing location with the provided properties.
     * @param req
     * @param res
     * @param next
     */
    static async replace(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            // Validate that the provided id exists and is a valid.
            const locationId = await joi.string().uuid().required().validateAsync(req.params.id);

            // Find the existing location.
            const location = locations.find(location => location.id === locationId);

            // Check if existing location was found.
            if (!location){
                res.status(404).end();
                return;
            }

            try {
                // Validate the new location object against the location schema, while forbidding the id, updated_at and created_at properties.
                const newLocation = await schema.keys({
                    id: joi.forbidden(),
                    updated_at: joi.forbidden(),
                    created_at: joi.forbidden()
                }).validateAsync(req.body)

                // Persist new location to datastore.

                // Respond with the created entity.
                res.json(newLocation);
            } catch (e) {
                if (e.name === 'ValidationError'){
                    res.status(422);
                    res.end();
                    return;
                }
                next(e)
                return;
            }

        } catch (e) {
            if (e.name === 'ValidationError') {
                res.status(400);
                res.end();
                return;
            }
            next(e);
            return;
        }
    }

    /**
     * @method
     * @description Delete an existing location.
     * @param req
     * @param res
     */
    static async delete(req: Request, res: Response): Promise <void> {

        // Validate that the provided id exists and is a valid.
        const locationId = await joi.string().uuid().required().validateAsync(req.params.id);

        // Find the existing location.
        const location = locations.find(location => location.id === locationId);

        if (!location){

            res.status(404);
            res.end();
            return

        }

        res.status(204);
        res.end();
    }

}

export default LocationController;