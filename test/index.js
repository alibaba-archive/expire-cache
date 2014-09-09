'use strict';
/*global describe, it, before, after, beforeEach, afterEach, Promise, noneFn*/

var Should = require('should'),
expireCache = require('../index.js');

describe('expireCache', function() {
  var dataCache = expireCache._getCache().cache;
  var indexCache = expireCache._getCache().index;
  var value = [1, 2, 3, 4, 5];

  beforeEach(function() {
    return expireCache.remove();
  });

  it('expireCache', function() {
    Should(expireCache).be['instanceof'](Function);
    Should(expireCache.get).be['instanceof'](Function);
    Should(expireCache.set).be['instanceof'](Function);
    Should(expireCache.remove).be['instanceof'](Function);
    Should(expireCache.namespace).be['instanceof'](Function);
    Should(expireCache).be.equal(indexCache[':']);
  });

  it('expireCache(key, value)', function() {
    Should(expireCache('test', value)).be.equal(expireCache);
    Should(dataCache[':test'].d).be.equal(value);
    Should(expireCache('key1', 1)('key2', 2)('key3', 3)).be.equal(expireCache);
    Should(dataCache[':key1'].d).be.equal(1);
    Should(dataCache[':key2'].d).be.equal(2);
    Should(dataCache[':key3'].d).be.equal(3);
  });

  it('expireCache(object)', function() {
    Should(expireCache({
      key: value,
      key1: 1
    })).be.equal(expireCache);
    Should(dataCache[':key'].d).be.equal(value);
    Should(dataCache[':key1'].d).be.equal(1);
  });

  it('expireCache()', function() {
    expireCache('key', value)('key1', 1)('key2', 2);
    var all = expireCache();
    Should(all).be['instanceof'](Object);
    Should(all.key).be.equal(value);
    Should(all.key1).be.equal(1);
    Should(all.key2).be.equal(2);
  });

  it('expireCache(key)', function() {
    expireCache('key', value);
    Should(expireCache('key')).be.equal(value);
  });

  it('expireCache(key, value, expire)', function(done) {
    expireCache('expire', value, 1);
    Should(expireCache('expire')).be.equal(value);
    return setTimeout(function() {
      Should(expireCache('expire')).be.equal(void 0);
      return done();
    }, 1.1 * 1000);
  });

  it('expireCache(object, expire)', function(done) {
    expireCache({
      key: value,
      key1: 1
    }, 1);
    Should(expireCache('key')).be.equal(value);
    Should(expireCache('key1')).be.equal(1);
    setTimeout(function() {
      Should(expireCache('key')).be.equal(void 0);
      Should(expireCache('key1')).be.equal(void 0);
      return done();
    }, 1.1 * 1000);
  });

  it('expireCache.remove(key)', function() {
    expireCache('key', value);
    Should(expireCache('key')).be.equal(value);
    expireCache.remove('key');
    Should(expireCache('key')).be.equal(void 0);
    Should(dataCache).not.have.property(':key');
  });

  it('expireCache.remove()', function() {
    expireCache('key1', 1);
    expireCache('key2', 2);
    Should(expireCache('key1')).be.equal(1);
    expireCache.remove();
    Should(expireCache('key1')).be.equal(void 0);
    Should(dataCache).be.empty;
  });

  it('expireCache.remove(keys)', function() {
    expireCache({
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
      key5: 5
    });
    Should(expireCache()).be.eql({
      key1: 1,
      key2: 2,
      key3: 3,
      key4: 4,
      key5: 5
    });
    expireCache.remove('key1', 'key2');
    Should(expireCache()).be.eql({
      key3: 3,
      key4: 4,
      key5: 5
    });
    expireCache.remove(['key3', 'key4'], 'key5');
    Should(expireCache()).be.empty;
  });

  it('expireCache.set(key, value)', function() {
    Should(expireCache.set('test', value)).be.equal(expireCache);
    Should(expireCache('test')).be.equal(value);
    Should(expireCache.set('key1', 1).set('key2', 2).set('key3', 3)).be.equal(expireCache);
    Should(expireCache('key1')).be.equal(1);
    Should(expireCache('key2')).be.equal(2);
    Should(expireCache('key3')).be.equal(3);
  });

  it('expireCache.get()', function() {
    var all;
    expireCache.set('key', value).set('key1', 1).set('key2', 2);
    all = expireCache.get();
    Should(all).be['instanceof'](Object);
    Should(all.key).be.equal(value);
    Should(all.key1).be.equal(1);
    Should(all.key2).be.equal(2);
  });

  it('expireCache.get(key)', function() {
    expireCache.set('key', value);
    Should(expireCache.get('key')).be.equal(value);
  });

  it('expireCache.set(key, value, expire)', function(done) {
    expireCache.set('expire', value, 1);
    Should(expireCache.get('expire')).be.equal(value);
    setTimeout(function() {
      Should(expireCache.get('expire')).be.equal(void 0);
      return done();
    }, 1.1 * 1000);
  });

  it('expireCache.namespace(namespace)', function(done) {
    var all, cache1, cache2, cache3;
    cache1 = expireCache.namespace('cache1');
    cache2 = expireCache.namespace('cache2');
    cache3 = cache2.namespace('cache3');
    Should(cache1).be['instanceof'](Function);
    Should(cache2).be['instanceof'](Function);
    Should(cache3).be['instanceof'](Function);
    Should(cache1).be.equal(indexCache[':cache1:']);
    Should(cache2).be.equal(indexCache[':cache2:']);
    Should(cache3).be.equal(indexCache[':cache2:cache3:']);
    Should(cache3).be.equal(cache2.namespace('cache3'));
    cache1('key', value);
    Should(cache1('key')).be.equal(value);
    Should(dataCache[':cache1:key'].d).be.equal(value);
    cache2({
      key: value,
      key1: 1
    });
    Should(cache2('key')).be.equal(value);
    Should(cache2('key1')).be.equal(1);
    cache3('expire', value, 1);
    Should(cache3('expire')).be.equal(value);
    Should(dataCache[':cache2:cache3:expire'].d).be.equal(value);
    cache3('key', value)('key1', 1)('key2', 2);
    all = cache3();
    Should(all).be['instanceof'](Object);
    Should(all.expire).be.equal(value);
    Should(all.key).be.equal(value);
    Should(all.key1).be.equal(1);
    Should(all.key2).be.equal(2);
    setTimeout(function() {
      Should(cache3.get('expire')).be.equal(void 0);
      return done();
    }, 1.1 * 1000);
  });

  it('expireCache.namespace(namespace, expire)', function(done) {
    var cache;
    cache = expireCache.namespace('cache', 1);
    Should(cache).be['instanceof'](Function);
    cache('key1', value);
    Should(cache('key1')).be.equal(value);
    cache('key2', value, 1.5);
    Should(cache('key2')).be.equal(value);
    setTimeout(function() {
      Should(cache('key1')).be.equal(void 0);
    }, 1.1 * 1000);
    setTimeout(function() {
      Should(cache('key2')).be.equal(void 0);
      return done();
    }, 1.6 * 1000);
  });

});

