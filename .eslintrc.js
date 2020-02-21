module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "plugins": [
      "react",
      "react-hooks"
    ],
    "env": {
      "browser": true
    },
    "rules": {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
};
