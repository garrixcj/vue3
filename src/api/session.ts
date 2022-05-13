import http from '@/http/http';
import multiHttp from '@/http/multi';

export const session = {
  http,
  // /**
  //  * @param  {object} form.gm_username
  //  * @param  {object} form.gm_password
  //  * @param  {object} form.gm_password // todo ubauth
  //  */
  // login(form: object) {
  //   return this.http.post('/login', form);
  // },
  // logout() {
  //   return this.http.post('/logout');
  // },
  /**
   * 取得 session
   */
  getSession() {
    return this.http.get('/session');
  },
};

export default session;

export const multi = { ...session, http: multiHttp };
