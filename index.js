// **Github:** https://github.com/teambition/expire-cache
//
// **License:** MIT

/* global module, define */

;(function (root, factory) {
  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.expireCache = factory();
  }
}(typeof window === 'object' ? window : this, function () {
  'use strict';

  var dataCache = {}, indexCache = {}, slice = [].slice;

  function forEach(obj, iterator, context) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) iterator(obj[key], key, obj);
    }
  }

  function removeKeys(keys, namespace) {
    forEach(keys, function(key) {
      if (key && typeof key === 'object') removeKeys(key, namespace);
      delete dataCache[namespace + key];
    });
  }

  function getValue(expireCache, key, value) {
    value = value || dataCache[expireCache._ns + key];
    if (!value) return;
    if (Date.now() <= value.e) return value.d;
    delete dataCache[expireCache._ns + key];
  }

  function expireCacheFactory(namespace, defaultExpire) {
    var expireCache;

    namespace = (namespace || '') + ':';
    defaultExpire = defaultExpire > 0 ? +defaultExpire : 60 * 5;

    expireCache = indexCache[namespace] || function (key, value, expire) {
      if (arguments.length > 1 || (key && typeof key === 'object')) {
        return expireCache.set(key, value, expire);
      }
      return expireCache.get(key);
    };

    expireCache._ns = namespace;
    expireCache._ex = defaultExpire;
    if (indexCache[namespace]) return expireCache;

    indexCache[namespace] = expireCache;

    expireCache.get = function (key) {
      var result = {};
      if (key != null) return getValue(expireCache, key);

      forEach(dataCache, function(value, key) {
        if (key.indexOf(expireCache._ns) !== 0) return;
        key = key.slice(expireCache._ns.length);
        value = getValue(expireCache, key, value);
        if (value) result[key] = value;
      });
      return result;
    };

    expireCache.set = function (key, value, expire) {
      var object = {};
      if (key && typeof key === 'object') {
        object = key;
        expire = value;
      } else {
        object[key] = value;
      }

      var _expire = expire >= 0 ? expire : expireCache._ex;
      _expire = +_expire * 1000 + (+new Date());

      forEach(object, function(value, key) {
        key = expireCache._ns + key;
        dataCache[key] = dataCache[key] || {};
        dataCache[key].d = value;
        // expire 为 `false` 时，将不会更新过期时间
        if (expire !== false || !dataCache[key].e) dataCache[key].e = _expire;
      });
      return expireCache;
    };

    expireCache.remove = function (key) {
      if (typeof key === 'undefined' || (key + '') === '') {
        forEach(dataCache, function(value, key) {
          if (key.indexOf(expireCache._ns) !== 0) return;
          delete dataCache[key];
        });
      } else {
        removeKeys(slice.call(arguments), expireCache._ns);
      }
      return expireCache;
    };

    expireCache.namespace = function (namespace, defaultExpire) {
      if (namespace == null) return expireCache;
      namespace = expireCache._ns + namespace;
      defaultExpire = defaultExpire > 0 ? +defaultExpire : expireCache._ex;
      return expireCacheFactory(namespace, defaultExpire);
    };

    return expireCache;
  }

  var expireCache = expireCacheFactory();

  expireCache.NAME = 'expireCache';
  expireCache.VERSION = 'v0.2.0';

  expireCache._getCache = function () {
    return {
      cache: dataCache,
      index: indexCache
    };
  };
  return expireCache;
}));
