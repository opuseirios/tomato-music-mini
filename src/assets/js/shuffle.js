export function shuffle(list) {
  let _list = list.slice();
  for(let i=0;i<_list.length;i++){
    let j = getRandom(0,i);
    let t = _list[i];
    _list[i]=_list[j];
    _list[j]=t;
  }
  return _list;
}

function getRandom(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
