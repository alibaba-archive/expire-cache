expire-cache v0.1.0 [![Build Status](https://travis-ci.org/teambition/expire-cache.svg)](https://travis-ci.org/teambition/expire-cache)
====
A simple cache that supports expiring and namespace.

## DEMO

```js
expireCache('key1', 123);
console.log(expireCache('key1')); // 123

expireCache.set('key2', 456);
console.log(expireCache.get('key2')); // 456

var cache1 = expireCache.namespace('test');
cache1('key', 789);
console.log(cache1('key')); // 789

var cache2 = cache1.namespace('test');
cache2('key', 123);
console.log(cache1('key')); // 789
console.log(cache2('key')); // 123
```

## Installation

**Node.js:**

    npm install expire-cache

**Bower:**

    bower install expire-cache

**browser:**

```html
<script src="/pathTo/expire-cache/index.js"></script>
```

## API

```js
var expireCache = require('expire-cache');
```

### expireCache()
### expireCache(key)
### expireCache(object)
### expireCache(object, expire)
### expireCache(key, value)
### expireCache(key, value, expire)
### expireCache.get()
### expireCache.get(key)
### expireCache.set(object)
### expireCache.set(object, expire)
### expireCache.set(key, value)
### expireCache.set(key, value, expire)
### expireCache.remove()
### expireCache.remove(key)
### expireCache.remove(keys)
### expireCache.namespace(namespace)
### expireCache.namespace(namespace, expire)

