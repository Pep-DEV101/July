* Promise is a future value
* Promise inital state=> pending
                settled 
                        Resolved    
                        Rejected
* Promise is comsumed using two sync functions then and catch
that are used to attach a cb to the promise and they also return promise
* cb are called asynchronously when promise is settled
*  The promise returned from then is in sync to it's cb
