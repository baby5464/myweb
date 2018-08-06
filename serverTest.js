

var homePath = './nd/'
var server = require(homePath+"server/server")
var router = require(homePath+"server/router")

var requestHandlers = require(homePath+"server/requestHandlers")


var handler = {}
handler['/'] = requestHandlers.start
handler['/start'] = requestHandlers.start
handler['/postdata'] = requestHandlers.postdata
handler['/upload'] = requestHandlers.upload
handler['/upfile'] = requestHandlers.upfile
handler['/getAccessToken'] = requestHandlers.getAccessToken


server.serverStart(router.route, handler, requestHandlers)