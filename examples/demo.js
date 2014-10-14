'use strict'

var expireCache = require('../index.js')

expireCache('key1', 123)
console.log(expireCache('key1')) // 123

expireCache.set('key2', 456)
console.log(expireCache.get('key2')) // 456

var cache2 = expireCache.namespace('test')
cache2('key3', 789)
console.log(cache2('key3')) // 789
