import events from 'events';
export const EventEmitter = new events.EventEmitter();

// create event which will be fired later by diffrent services
EventEmitter.on('signup', async (data:any) => {  // event listener 
    // send email or do any thing
    console.log('new user signup data:')
    console.log(data)
  });


    // implemet this in user service when user signup
    async function signup(user:any) {
        // emit 'signup' event
        EventEmitter.emit('signup', user)
      }



  
