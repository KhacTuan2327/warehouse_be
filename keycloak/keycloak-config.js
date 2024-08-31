const Keycloak = require('keycloak-connect');
const session = require('express-session');
// Cấu hình session
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });
module.exports = {
    keycloak: keycloak,
    session: session({
      secret: 'SQnurFEYrMNyUKTO6d3eK1XwdOYnc9Mq', // Thay đổi secret cho bảo mật
      resave: false,
      saveUninitialized: true,
      store: memoryStore
    })
  };