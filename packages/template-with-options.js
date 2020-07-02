
function buildMiddleware({
  options,
} = {}) {
  return (next) => async (request) => {
    //
    // BEFORE
    // Modify/Use Request
    //
    
    const response = await next(request);

    //
    // AFTER
    // Modify/Use Response
    //

    return response;
  }
}

export default buildMiddleware;
