import { ZodError } from 'zod';


const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation Failed',
      errors: err.errors.map(e => ({
        path: e.path[0],
        message: e.message
      }))
    });
  }

  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
};

export default errorHandler;