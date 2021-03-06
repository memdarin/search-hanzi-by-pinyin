(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.pinyinUtils = factory());
}(this, (function () { 
    'use strict';
    function _isArray( array ){
        return Object.prototype.toString.call( array ) === '[object Array]';
    };
    var pinyinUtils = {
        searchHanziByPinyin(key, list, pinyinKey, hanziKey, isInitial){
            var _initialKey= '__INITIAL';
            var _result = {
                hanzi: [],
                list: []
            };
            if( !key || !_isArray(list) || list.length === 0 || !pinyinKey || !hanziKey ){
                return _result;
            }
            // 去掉 空格 和 \
            var _key = key.replace(/(\s|\\)/ig, '');
            if( _key.length === 0 ){
                return _result;
            }
            var _filterRegex = new RegExp(`(${_key})`, 'ig');
            var _filterResult = [];
            // 按汉字过滤
            if( _key.match(/^[\u4e00-\u9fa5]+$/) ){
                _filterResult = list.filter((item)=>{
                    return item[hanziKey].match(_filterRegex);
                });
            }
            if( _filterResult.length > 0 ){
                _result.hanzi.push( _key );
                _result.list = _filterResult;
                return _result;
            }
            if(!_key.match(/^[a-zA-Z]+$/))
            {
                return _result;
            }

            // 按拼音过滤

            // 根据拼音提取首字母
            if( isInitial ){
                list.forEach((item)=>{
                    item[_initialKey] = item[pinyinKey].match(/\b\w/ig).join(' ');
                });
                pinyinKey = _initialKey;
            }
            // 先过滤出满足条件的列表
            _filterResult = list.filter((item)=>{
                return item[pinyinKey].replace(/\s/g, '').match(_filterRegex);
            });
            if( _filterResult.length === 0 ){
                return _result;
            }

            var _pyFilterRegex = new RegExp('\\d*' + _key.split('').join('\\d*') + '\\d*', 'ig');
            var _hanziList = [];
            var _validList = [];
            _filterResult.forEach((item)=>{
                var _newpy = [];
                var _oldpy = item[pinyinKey].split(' ');
                _oldpy.forEach((item, index)=>{
                    _newpy.push(index);
                    _newpy.push(item);
                });
                var _newpystr = _newpy.join('');
                _newpystr += (_oldpy.length );
                var _word = (_newpystr.match( _pyFilterRegex ) || [])[0] || '';
                if(!_word){
                    return false;
                }
                var _hanzi = [];
                _word = _word.match(/\d+/g);
                if(!_word || _word.length < 2){
                    return false;
                }
                _word.pop();
                _word.forEach((idx)=>{
                    _hanzi.push( item[hanziKey].substr(idx, 1));
                });
                var _hanzistr = _hanzi.join('');
                if( _hanziList.indexOf(_hanzistr) === -1 ){
                    _hanziList.push(_hanzistr);
                }
                _validList.push(item);
            });
            _result.hanzi = _hanziList;
            _result.list = _validList;
            return _result;
        }
    };
    return pinyinUtils;
})));
