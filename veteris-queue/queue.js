var kue = require('kue');     
var queue = kue.createQueue();   


queue.watchStuckJobs(6000);

queue.on('ready', () => {  
  // If you need to 
  console.info('Queue is ready!');
});

queue.on('error', (err) => {  
  // handle connection errors here
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});

/*
function createPayment(data, done) {  
  queue.create('payment', data)
    .priority('critical')
    .attempts(8)
    .backoff(true)
    .removeOnComplete(false)
    .save((err) => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}  */

queue.process('payment', 20, (job, done) => {  
  console.log("dd");

  done();
});

/*

module.exports = {  
  create: (data, done) => {
    createPayment(data, done);
  }
};  */