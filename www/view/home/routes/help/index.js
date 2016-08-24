module.exports = {
  path: 'help',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/help'))
    })
  }
}
