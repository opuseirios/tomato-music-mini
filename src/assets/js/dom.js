/*添加类名*/
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

/*获取属性*/
export function getData(el, attr, value) {
  const prefix = 'data-';
  attr = prefix + attr;
  if (value) {
    return el.setAttribute(attr, value)
  } else {
    return el.getAttribute(attr);
  }
}

