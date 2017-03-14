import ajax from './ajax';

function wrapper(method, url, options, getInst) {
  if (options) options.timeout = 10000;
  else options = { timeout: 10000 };
  return new Promise((resolve, reject) => {
    const request = ajax[method.toLowerCase()](url, options).then((res, pointer) => {
      if (request._request.status.toString() === '302' || request._request.responseText.match('<!')) {
        location.href = '#/login';
      }
      resolve(res, pointer);
    }, (err, pointer) => {
      reject(err, pointer);
    });
    if (typeof getInst === 'function') {
      getInst(request);
    }
  });
}

export default {
  get: wrapper.bind(null, 'GET'),
  post: wrapper.bind(null, 'POST'),
  delete: wrapper.bind(null, 'DELETE'),
  put: wrapper.bind(null, 'PUT'),
  setDomain: ajax.setDomain,
  onError: ajax.onError,
  onSuccess: ajax.onSuccess,
  enableFormat: ajax.enableFormat,
};
