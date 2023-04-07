export function formatMessageAndStackTrace(message: string, stackTrace: string|undefined): string {
    try {
        if(typeof stackTrace === 'string'){
            const stackLinesWithoutMessage = stackTrace.split('\n').slice(1);
            const messageAndStackMerged = [
                message,
                ...stackLinesWithoutMessage
            ]
            return messageAndStackMerged.join('\n')
        }else {
            throw new Error('Stacktrace não foi informado')
        }
    }catch(error){
        return message
    }

}