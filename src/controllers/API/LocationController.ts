import { NextFunction, Request, Response } from "express";
import * as joi from "joi";
import * as locations from "../../locations.json";

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
            full: joi.string().required()
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

    static async index(req: Request, res: Response, next: NextFunction): Promise<void> {

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
     */
    static update(req: Request, res: Response){



    }

    static replace(){

    }

    static delete(){

    }

}

export default LocationController;