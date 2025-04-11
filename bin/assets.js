#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
function getExtension(filename) {
  var ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
}
function deep(dir, parentDir) {
  const arr = fs.readdirSync(path.join(__dirname, dir));
  arr.filter(fileName => !['.git', '.gitkeep', '.gitignore', 'hiep'].includes(fileName))
    .forEach(item => {
      const fileExtension = getExtension(item);
      const fullPath = parentDir + item;
      const itemPath = path.join(__dirname, dir + item);
      const isDir = fs.statSync(itemPath).isDirectory()
      if (isDir) {
        const temp = dir + item + '/'
        deep(temp, parentDir + item + '/')
      } else {
        const isIcon = !item.startsWith('iconfont') && item.endsWith('.svg');
        let s = '';
        if (isIcon) {
          const paths = fullPath.split('/');
          const prefrix = paths[0], name = paths[paths.length - 1];
          const surfix = [...paths.slice(1, paths.length - 1), name.split('.svg')[0]].join('/');
          s = prefrix + ':' + surfix;
          // fullPath.split('/').map((path, i) => {
          //   if (i === 0 && fullPath !== path) {
          //     s += `${path}:`;
          //   } else if (path.endsWith('.svg')) {
          //     s += '/' + path.split('.svg')[0];
          //   } else {
          //     s += i == 1 ? path : `/${path}`;
          //   }
          // })

        }

        const itemFormatted = {
          nzType: s,
          path: `/assets/${fullPath}`, name: isIcon ? item.split('.svg')[0] : item,
          isIcon,
          usingImg: ['.jpg', '.png', '.gif'].some(surfix => item.endsWith(surfix))
        }

        const group = assetsMap.get(fileExtension);
        if (!!group) {
          assetsMap.get(fileExtension).children.push(itemFormatted);
        } else {
          assetsMap.set(fileExtension, { group: fileExtension, children: [itemFormatted] });
        }
      }
    })
}

let assetsMap = new Map();
deep('../src/assets/', '')
fs.writeFileSync('src/assets/list.json', JSON.stringify([...assetsMap.values()]));