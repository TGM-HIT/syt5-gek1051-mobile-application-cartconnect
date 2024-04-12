const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        getClipboard() {
          return clipboardy.readSync();
        }
      });
      
      return config;
    },
  },
});
