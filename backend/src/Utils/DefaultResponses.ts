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

export function default401Response(){
    return {message: 'Request unauthorized'}
}

export function default403Response(){
    return {message: "Don't have permission to access this resource"}
}