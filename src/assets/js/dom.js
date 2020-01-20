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

export function getData(el, attr, val) {
  attr = 'data-' + attr;
  if (val) {
    return el.setAttribute(attr, val)
  } else {
    return el.getAttribute(attr);
  }
}

let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()


export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.slice(1);
}
