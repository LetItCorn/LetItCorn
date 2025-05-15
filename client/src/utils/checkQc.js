const checkQc = function(value,stand){
  let bound = stand.split('~')
    if(value>bound[0] && value<bound[1]){
      return 'pass'
    }else{
      return 'fail'
    }
}