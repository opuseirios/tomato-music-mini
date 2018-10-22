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

/*前缀*/
export function prefixStyle(style) {
  if(vendor === false){
    return false
  }
  if(vendor === 'standard'){
    return style
  }
  return vendor+style.charAt(0).toUpperCase()+style.slice(1);
}

let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };
  for(let key in transformNames){
    if(elementStyle[transformNames[key]]!==undefined){
      return key;
    }
    return false
  }
})();
