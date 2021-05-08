import deindent from 'deindent';
import renderLayout from './Layout';

export default (data = {}) => {
  return renderLayout(Object.assign({}, data, {
    content: deindent(`
      <form method="POST">
        <label for="email">Enter your email address to log in:</label>
        <input type="hidden" name="returnTo" value="${data.returnTo || ''}">
        <input type="email" name="email" id="email" value="${data.email || ''}">
        <button>Log in</button>
        <a href="https://www.dunkman.me" class="cancel-link">Cancel</a>
      </form>
    `)
  }));
};
