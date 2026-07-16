import ApiError from "../errors/api-error.js";
import { ZodError } from "zod"; 

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        return next(new ApiError(400, errorMessage));
      }
      next(new ApiError(400, "Validation Error"));
    }
  };
};

export default validate;
