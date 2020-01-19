export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classes = el.className.split(' ');
  classes.push(className);
  el.className = classes.join(' ');
}

export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function getData(el,attr,val) {
  attr = 'data-'+attr;
  if(val){
    return el.setAttribute(attr,val)
  }else {
    return el.getAttribute(attr);
  }
}
