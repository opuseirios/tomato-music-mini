
export function addClass(dom,className) {
  if(hasClass(dom,className)){
    return
  }
  const classnames = dom.className.split(' ');
  classnames.push(className);
  dom.className = classnames.join(' ');
}

function hasClass(dom,className) {
  const classnames = dom.className.split(' ');
  return classnames.findIndex((item)=>{
      return item.trim() === className.trim()
  })>-1;
}
