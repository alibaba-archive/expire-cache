expire-cache v0.1.1 [![Build Status](https://travis-ci.org/teambition/expire-cache.svg)](https://travis-ci.org/teambition/expire-cache)
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


#### expireCache()
#### expireCache.get()
return all data

```js
  var data1 = expireCache();
  var data2 = expireCache.get();
```

#### expireCache(key)
#### expireCache.get(key)
return data for key

```js
  var data1 = expireCache('test1');
  var data2 = expireCache.get('test2');
```

#### expireCache(object)
#### expireCache(key, value)
#### expireCache.set(object)
#### expireCache.set(key, value)
set data with default expire time(5 sec), return `expireCache`

```js
  expireCache({test1: 123});
  expireCache.set({test2: 123});
  expireCache({test3: 1234, test4: 12345});
  expireCache('key1', 123);
  expireCache.set('key2', 123);
  expireCache('key3', 1234)('key4', 12345);
```

#### expireCache(object, expire)
#### expireCache(key, value, expire)
#### expireCache.set(object, expire)
#### expireCache.set(key, value, expire)
set data with expire time, return `expireCache`

```js
  expireCache({test1: 123}, 1); // expire in 1 sec
  expireCache.set({test2: 123}, 1); // expire in 1 sec
  expireCache('key1', 123, 10); // expire in 10 sec
  expireCache.set('key2', 123, 10); // expire in 10 sec
```

#### expireCache.remove()
remove all data, return `expireCache`

```js
  expireCache.remove();
```

#### expireCache.remove(key)
#### expireCache.remove(key1, key2, ...)
#### expireCache.remove([key1, key2, ..])
remove data for key, return `expireCache`

```js
  expireCache.remove('key').remove('key1', 'key2', 'key3');
  expireCache.remove(['key1', 'key2', 'key3']);
  expireCache.remove('key', ['key1', 'key2'], ['key3', 'key4', 'key5']);
```

#### expireCache.namespace(namespace)
#### expireCache.namespace(namespace, expire)
return a sub `expireCache` with namespace and expire time(default 5 sec)

```js
  var cache1 = expireCache.namespace('cache1');
  var cache2 = expireCache.namespace('cache2', 10);
  var cache3 = cache2.namespace('cache3', 1);

  cache3({key1: 1, key2: 2});
  cache3('key3', 3);
  cache3(); // return {key1: 1, key2: 2, key3: 3}

  cache2.remove();
  cache3(); // return {}
```
