const generalError ="Unknown error, we can't determine the error"
export const apiErrorHandler = (err,alert)=>{
    try{
        let message = null;
        if(err.response && err.response.data){
            if(err.response.data.message)
                message = err.response.data.message;
            if(err.response.data.data && err.response.data.data.message)
                message = err.response.data.data.message;
        }
        else{
            if(err && err.message){
                message = err.message
            }
        }
        if(message){
            if(alert){
                alert({type: 'danger', timeout: 5000, message:message})
            }
            else{
                return message;
            }
        }
        else{
            if(alert){
                alert({type: 'danger', timeout: 5000, message:generalError})
            }
            else{
                return generalError;
            }
        }
            
        return null;
    }
    catch(error){
        let message = null;
        error = null;
        if(error && error.message){
                message = error.message
        }
        if(message){
            if(alert){
                alert({type: 'danger', timeout: 5000, message:message})
            }
            else{
                return message;
            }
        }
        else{
            
            if(alert){
                alert({type: 'danger', timeout: 5000, message:generalError})
            }
            else{
                return generalError;
            }
                
            
        }
    }
    
}