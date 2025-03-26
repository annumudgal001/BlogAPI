function isActiveRoute(route,currentroute){
    return route === currentroute?'active':''
}

module.exports = isActiveRoute;