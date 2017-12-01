var AWS = require('aws-sdk'),
    s3 = new AWS.S3();

module.exports = {
   expandFolder : function(contents, callback){
  	var keys = [];
  	contents.forEach(function(file){
  		keys.push(file.Key);
  	});
  	callback(keys);
  },

  getFolder : function(args, callback){
  	debugger;
  	var params = {
  		Bucket: 'europe.photos', /* required */
   		Prefix: args.key /* required */
  	}

  	s3.listObjects(params, function(err, data){
  		if (err) console.log(err, err.stack);
  		else callback(data.Contents);
  	});
  },

  getObject : function(args, callback){
  	var params = {
  		Bucket: 'europe.photos',
  		Key: args.key
  	}

  	s3.getObject(params, function(err, data){
  		if (err) console.log(err, err.stack);
  		else callback(data);
  	});
  }

};
