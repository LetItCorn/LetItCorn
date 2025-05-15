const checkQc = function(value,stand){
  let bound = stand.split('~')
  console.log(bound);
  console.log(value);
    if(parseFloat(value)>=parseFloat(bound[0]) && parseFloat(value)<=parseFloat(bound[1])){
      return 'pass'
    }else{
      return 'fail'
    }
}
module.exports = {
  checkQc
};