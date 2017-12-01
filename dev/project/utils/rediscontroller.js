var redis = require("redis"),
    client = redis.createClient(),
    Promise = require('promise');

module.exports = {
    hmset : function(args){
      var hmap = [];
      args.entries.forEach(function(entry){
        hmap.push(entry.field);
        hmap.push(entry.value);
      });
      client.hmset(args.key, hmap);
    },

    sadd : function(args){
      client.sadd(args.key, args.members);
    },

    get : function(args){
      if ("undefined" === typeof args.fields){
        return new Promise(function (fulfill, reject){
          client.mget(args.key, function(err, value){
            if (err) reject(err);
            else fulfill(value);
          });
        });

      } else {
        return new Promise(function (fulfill, reject){
          client.hmget(args.key, args.fields, function(err, value){
            if (err) reject(err);
            else fulfill(value);
          });
        });

        //TODO: put in something here to get from multiple hmaps
      }
    },

    getAll : function(key){
      return new Promise(function (fulfill, reject){
        client.hgetall(key, function(err, value){
          if (err) reject(err);
          else fulfill(value);
        });
      });
    },

    smembers: function(key){
      return new Promise(function (fulfill, reject){
        client.smembers(key, function(err, value){
          if (err) reject(err);
          else fulfill(value);
        });
      });

    }
};
