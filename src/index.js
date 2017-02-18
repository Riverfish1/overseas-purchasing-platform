import dva from 'dva';
import { hashHistory } from 'dva/router';
import createLoading from 'dva-loading';
import { message } from 'antd';
import utilRegister from './utils';
import './index.html';
import './index.css';

const ERROR_MSG_DURATION = 3; // 3 秒

// 注册辅助方法
utilRegister();

// 1. Initialize
const app = dva({
  history: hashHistory,
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// Moved to router.js

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

window.redirector = (url) => {
  location.href = `#${url}`;
};
