export function default400Response(errors: string[]){
    return {
        message: "The request contain errors",
        errors: errors
    }
}

export function default201Response(message: string){
    return {message}
}

export function default500Response(){
    return {message: "A server internal error ocurred, please, try again later"}
}