Shelly.addStatusHandler(function(e) {
  console.log(e);
  if(e.component === 'input:0' && e.delta.state === false) {
    Shelly.call('Switch.set',{'id':0,'on':false});
  }
})