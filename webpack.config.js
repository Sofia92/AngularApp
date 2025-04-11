module.exports = {
	context:_dirname + '/app',
	entry:'./index.js',
	output:{
		path:_dirname + '/app',
		filename:'./bundle.js'
	},
	module:{
		loader:[
			{test:/\.html$/,loader:'raw'}
			{test:/\.css$/,loader:'style!css'}
			{test:/\.scss$/,loader:'style!css!sass'}
			{test:/\.(png|jpg|ttf)$/,loader:'url?limit=8192'}
		]
	}
};