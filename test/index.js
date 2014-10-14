'use strict'

var tman = require('tman')
var should = require('should')
var expireCache = require('..')

tman.suite('expireCache', function () {
  var dataCache = expireCache._getCache().cache
  var indexCache = expireCache._getCache().index
  var value = [1, 2, 3, 4, 5]

  tman.beforeEach(function () {
    expireCache.remove()
  })

  tman.it('expireCache', function () {
    should(expireCache).be.Function()
    should(expireCache.get).be.Function()
    should(expireCache.set).be.Function()
    should(expireCache.remove).be.Function()
    should(expireCache.namespace).be.Function()
    should(expireCache).be.equal(indexCache[':'])
  })

  tman.it('expireCache(key, value)', function () {
    should(expireCache('test', value)).be.equal(expireCache)
    should(dataCache[':test'].d).be.equal(value)
    should(expireCache('key1', 1)('key2', 2)('key3', 3)).be.equal(expireCache)
    should(dataCache[':key1'].d).be.equal(1)
    should(dataCache[':key2'].d).be.equal(2)
    should(dataCache[':key3'].d).be.equal(3)
  })

  tman.it('expireCache(object)', function () {
    should(expireCache({
      key: value,
      key1: 1
    })).be.equal(expireCache)
    should(dataCache[':key'].d).be.equal(value)
    should(dataCache[':key1'].d).be.equal(1)
  })

  tman.it('expireCache()', function () {
    expireCache('key', value)('key1', 1)('key2', 2)
    var all = expireCache()
    should(all).be['instanceof'](Object)
    should(all.key).be.equal(value)
    should(all.key1).be.equal(1)
    should(all.key2).be.equal(2)
  })

  tman.it('expireCache(key)', function () {
    expireCache('key', value)
    should(expireCache('key')).be.equal(value)
  })

  tman.it('expireCache(key, value, expire)', function (done) {
    expireCache('expire', value, 1)
    should(expireCache('expire')).be.equal(value)
    setTimeout(function () {
      should(expireCache('expire')).be.equal(void 0)
      done()
    }, 1.1 * 1000)
  })

  tman.it('expireCache(object, expire)', function (done) {
    expireCache({
      key: value,
      key1: 1
    }, 1)
    should(expireCache('key')).be.equal(value)
    should(expireCache('key1')).be.equal(1)
    setTimeout(function () {
      should(expireCache('key')).be.equal(void 0)
      should(expireCache('key1')).be.equal(void 0)
      done()
    }, 1.1 * 1000)
  })

  tman.it('expireCache.remove(key)', function () {
    expireCache('key', value)
    should(expireCache('key')).be.equal(value)
    expireCache.remove('key')
    should(expireCache('key')).be.equal(void 0)
    should(dataCache).not.have.property(':key')
  })

  tman.it('expireCache.remove()', function () {
    expireCache('key1', 1)
    expireCache('key2', 2)
    should(expireCache('key1')).be.equal(1)
    expireCache.remove()
    should(expireCache('key1')).be.equal(void 0)
    should(dataCache).be.empty
  })

  tman.it('expireCache.remove(keys)', function () {
    expireCache({
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
      key5: 5
    })
    should(expireCache()).be.eql({
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
      key5: 5
    })
    expireCache.remove('key1', 'key2')
    should(expireCache()).be.eql({
      key3: 3,
      key4: 4,
      key5: 5
    })
    expireCache.remove(['key3', 'key4'], 'key5')
    should(expireCache()).be.empty
  })

  tman.it('expireCache.set(key, value)', function () {
    should(expireCache.set('test', value)).be.equal(expireCache)
    should(expireCache('test')).be.equal(value)
    should(expireCache.set('key1', 1).set('key2', 2).set('key3', 3)).be.equal(expireCache)
    should(expireCache('key1')).be.equal(1)
    should(expireCache('key2')).be.equal(2)
    should(expireCache('key3')).be.equal(3)
  })

  tman.it('expireCache.get()', function () {
    var all
    expireCache.set('key', value).set('key1', 1).set('key2', 2)
    all = expireCache.get()
    should(all).be['instanceof'](Object)
    should(all.key).be.equal(value)
    should(all.key1).be.equal(1)
    should(all.key2).be.equal(2)
  })

  tman.it('expireCache.get(key)', function () {
    expireCache.set('key', value)
    should(expireCache.get('key')).be.equal(value)
  })

  tman.it('expireCache.set(key, value, expire)', function (done) {
    expireCache.set('expire', value, 1)
    should(expireCache.get('expire')).be.equal(value)
    var ex = dataCache[':expire'].e
    expireCache.set('expire', 123, 0.5)
    should(dataCache[':expire'].e).not.be.equal(ex)
    ex = dataCache[':expire'].e
    expireCache.set('expire', value, false)
    should(dataCache[':expire'].e).be.equal(ex)
    setTimeout(function () {
      should(expireCache.get('expire')).be.equal(void 0)
      done()
    }, 1.1 * 1000)
  })

  tman.it('expireCache.namespace(namespace)', function (done) {
    var all, cache1, cache2, cache3
    cache1 = expireCache.namespace('cache1')
    cache2 = expireCache.namespace('cache2')
    cache3 = cache2.namespace('cache3')
    should(cache1).be['instanceof'](Function)
    should(cache2).be['instanceof'](Function)
    should(cache3).be['instanceof'](Function)
    should(cache1).be.equal(indexCache[':cache1:'])
    should(cache2).be.equal(indexCache[':cache2:'])
    should(cache3).be.equal(indexCache[':cache2:cache3:'])
    should(cache3).be.equal(cache2.namespace('cache3'))
    cache1('key', value)
    should(cache1('key')).be.equal(value)
    should(dataCache[':cache1:key'].d).be.equal(value)
    cache2({
      key: value,
      key1: 1
    })
    should(cache2('key')).be.equal(value)
    should(cache2('key1')).be.equal(1)
    cache3('expire', value, 1)
    should(cache3('expire')).be.equal(value)
    should(dataCache[':cache2:cache3:expire'].d).be.equal(value)
    cache3('key', value)('key1', 1)('key2', 2)
    all = cache3()
    should(all).be['instanceof'](Object)
    should(all.expire).be.equal(value)
    should(all.key).be.equal(value)
    should(all.key1).be.equal(1)
    should(all.key2).be.equal(2)
    setTimeout(function () {
      should(cache3.get('expire')).be.equal(void 0)
      done()
    }, 1.1 * 1000)
  })

  tman.it('expireCache.namespace(namespace, expire)', function (done) {
    var cache
    cache = expireCache.namespace('cache', 1)
    should(cache).be['instanceof'](Function)
    cache('key1', value)
    should(cache('key1')).be.equal(value)
    cache('key2', value, 1.5)
    should(cache('key2')).be.equal(value)
    setTimeout(function () {
      should(cache('key1')).be.equal(void 0)
    }, 1.1 * 1000)
    setTimeout(function () {
      should(cache('key2')).be.equal(void 0)
      done()
    }, 1.6 * 1000)
  })
})
