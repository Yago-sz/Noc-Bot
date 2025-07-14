class WarningError extends Error{
    constructor(message){
        super(message)
        this.name = "DangerError";
    }
}
module.exports = { 
    WarningError,
    
}