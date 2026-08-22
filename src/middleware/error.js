function asyncHandler(fn){return(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next)}
function notFoundHandler(req,res){res.status(404).json({error:{code:'NOT_FOUND',message:'Route not found'}})}
function errorHandler(err,req,res,next){req.log?.error?.(err);if(res.headersSent)return next(err);res.status(err.status||500).json({error:{code:err.code||'INTERNAL_ERROR',message:err.publicMessage||err.message||'Internal error'}})}
module.exports={asyncHandler,notFoundHandler,errorHandler};
