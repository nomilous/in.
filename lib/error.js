module.exports = InfusionError;

function InfusionError(msg, info) {
  var e = Error.apply(this, arguments);
  if (typeof info === 'undefined') info = {};
  Object.defineProperty(e, 'name', {value: 'InfusionError'});
  Object.defineProperty(e, 'info', {value: info});
  return e;
}
