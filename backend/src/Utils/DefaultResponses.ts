export function default400Response(errors: string[]){
    return {
        message: "The request contain errors",
        errors: errors
    }
}