'use strict';

const util = require('./util');

const convertToJson = function(node, options) {
  const jObj = {};

  //when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        jObj[options.textNodeName] = node.val;
      }
    }
  }

  util.merge(jObj, node.attrsMap);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    var objTagName = mapTagName(tagname, options)
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj[objTagName] = [];
      for (var tag in node.child[tagname]) {
        jObj[objTagName].push(convertToJson(node.child[tagname][tag], options));
      }
    } else {
      jObj[objTagName] = convertToJson(node.child[tagname][0], options);
    }
  }

  //add value
  return jObj;
};

const mapTagName = (tagName, options) => {
  var newTagName = tagName;
  if(options && options.lowercaseFirstLetterInTagNames){
    newTagName = tagName.replace(/^\w/, (chr) => chr.toLowerCase() );
  }
  return newTagName;
}

exports.convertToJson = convertToJson;
