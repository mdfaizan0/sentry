export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const errorStatusCode = err.statusCode || 500
    const errorMessage = err.message || "Something went wrong!"
    res.status(errorStatusCode).json({ message: errorMessage, success: false });
};