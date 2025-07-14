class InvalidParameterError extends Error{
    constructor(message){
        super(message)
        this.name = "DangerError";
    }
}
module.exports = { 
    InvalidParameterError,
    
}