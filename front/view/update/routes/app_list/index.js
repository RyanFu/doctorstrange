module.exports = {
  path: 'appList',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./template/applist'))
    })
  }
}
