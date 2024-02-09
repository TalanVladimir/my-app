const getValue = (x, y) => (isFirefox ? GM.getValue(x, y) : GM_getValue(x, y));
const setValue = (x, y) => (isFirefox ? GM.setValue(x, y) : GM_setValue(x, y));
const getCopyText = () => replaceFirstLast(window.getSelection().toString());
const replaceFirstLast = str =>
  str.replace(/^\s+|^\n+|^\t+|\s+$|\n+$|\t+$/g, '');
const replaceAll = (str, find, replace) =>
  str.replace(new RegExp(find, 'g'), replace);

const getCopyStyle = () => getValue('myCopyStyle', 0);
const setCopyStyle = x => setValue('myCopyStyle', x);

const pop = (...args) => alert(args.join('\n'));
const log = (...args) => console.log.apply(console, args);

const addGlobalStyle = css => {
  let head = document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  if (!head) return;
  style.innerHTML = css;
  head.appendChild(style);
};

const getCss = GM_getResourceText('getCssMain').split(/[\r\n]+/gm);
let setCss;
for (let s = 0; s < getCss.length; s++) {
  if (s == 0) setCss = getCss[s];
  else setCss = setCss + '\n' + getCss[s];
}
addGlobalStyle(setCss);

const isFirefox = typeof InstallTrigger !== 'undefined';

const addCopyElement = text => {
  const newCopyElement = document.createElement('a');
  newCopyElement.className = 'myCopyStyleItem';
  newCopyElement.text = text;
  return newCopyElement;
};
const myCopyStyleClass = document.createElement('div');
myCopyStyleClass.id = 'myCopyStyleMsg';
myCopyStyleClass.className = 'myCopyStyleClass';

const myCopyStyle0 = addCopyElement('Default');
const myCopyStyle1 = addCopyElement('Vertical');
const myCopyStyle2 = addCopyElement('Horizontal');
const myCopyStyle3 = addCopyElement('OneLine');

myCopyStyleClass.append(myCopyStyle0, myCopyStyle1, myCopyStyle2, myCopyStyle3);

let escDate = new Date();

const changeCopyStyle = newValue => {
  setCopyStyle(newValue);
  myCopyStyleClass.remove();
};

const updateCopyStyle = () => {
  const active = document.activeElement;
  if (active.tagName == 'TEXTAREA' || active.tagName == 'INPUT') {
    active.blur();
  }

  const nDate = new Date();
  if (Math.abs(escDate.getTime() - nDate.getTime()) / 1000 > '0.2') {
    escDate = nDate;
    return;
  }

  let childMenu = document.body;
  if (!childMenu) return;
  childMenu.appendChild(myCopyStyleClass);

  escDate = nDate;
  myCopyStyleClass.onclick = () => myCopyStyleClass.remove();
  myCopyStyle0.onclick = () => changeCopyStyle(0);
  myCopyStyle1.onclick = () => changeCopyStyle(1);
  myCopyStyle2.onclick = () => changeCopyStyle(2);
  myCopyStyle3.onclick = () => changeCopyStyle(3);

  myCopyStyle0.classList.remove('active');
  myCopyStyle1.classList.remove('active');
  myCopyStyle2.classList.remove('active');
  myCopyStyle3.classList.remove('active');
  switch (getCopyStyle()) {
    default:
      myCopyStyle0.classList.add('active');
      break;
    case 1:
      myCopyStyle1.classList.add('active');
      break;
    case 2:
      myCopyStyle2.classList.add('active');
      break;
    case 3:
      myCopyStyle3.classList.add('active');
      break;
  }
};

document.addEventListener('copy', event => {
  switch (getCopyStyle()) {
    case 1:
      event.clipboardData.setData('text/plain', getCopyText());
      event.preventDefault();
      break;
    case 2:
      event.clipboardData.setData(
        'text/plain',
        replaceAll(getCopyText(), '\n', '\t'),
      );
      event.preventDefault();
      break;
    case 3:
      event.clipboardData.setData('text/html', getCopyText());
      event.preventDefault();
      break;
  }
});

const myHotkeys = () => {
  return new Map().set('escape', updateCopyStyle);
};
new SetHotkeys(myHotkeys()).start(true);
