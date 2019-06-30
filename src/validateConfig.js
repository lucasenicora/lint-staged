/* eslint no-prototype-builtins: 0 */

'use strict'

const chalk = require('chalk')
const format = require('stringify-object')

const debug = require('debug')('lint-staged:cfg')

const formatError = helpMsg => `● Validation Error:

  ${helpMsg}

Please refer to https://github.com/okonet/lint-staged#configuration for more information...`

const createError = (opt, helpMsg, value) =>
  formatError(`Invalid value for '${chalk.bold(opt)}'.

  ${helpMsg}.
 
  Configured value is: ${chalk.bold(
    format(value, { inlineCharacterLimit: Number.POSITIVE_INFINITY })
  )}`)

/**
 * Runs config validation. Throws error if the config is not valid.
 * @param config {Object}
 * @returns config {Object}
 */
module.exports = function validateConfig(config) {
  debug('Validating config')

  const errors = []

  if (!config || typeof config !== 'object') {
    errors.push('Configuration should be an object!')
  } else {
    const globs = Object.keys(config)

    if (globs.length === 0) {
      errors.push('Configuration should not be empty!')
    }

    globs.forEach(key => {
      if (
        (!Array.isArray(config[key]) ||
          config[key].some(item => typeof item !== 'string' && typeof item !== 'function')) &&
        typeof config[key] !== 'string' &&
        typeof config[key] !== 'function'
      ) {
        errors.push(
          createError(
            key,
            'Should be a string, a function, or an array of strings and functions',
            key
          )
        )
      }
    })
  }

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }

  return config
}
