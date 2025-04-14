module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'style', 'merge', 'revert', 'core', 'docs', 'perf']],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
  },
}
