// Type definitions for MainBingo

/**
 * @typedef {Object} GameConfig
 * @property {string} ruleId
 * @property {string} ruleName
 * @property {string} ruleDescription
 * @property {number} cardPrice
 * @property {number} maxCardsPerPlayer
 * @property {number} prizeAmount
 */

/**
 * @typedef {Object} GameState
 * @property {boolean} active
 * @property {Object} game
 * @property {string} game.status
 * @property {number} game.prizeAmount
 * @property {Array} game.drawnNumbers
 * @property {GameConfig} config
 * @property {Array} myCards
 * @property {number} balance
 * @property {number} totalCards
 * @property {number} playerCount
 * @property {Object} rule
 */

export const GAME_STATUS = {
  SETUP: 'setup',
  COUNTDOWN: 'countdown',
  IN_PROGRESS: 'in_progress',
  BINGO_CALLED: 'bingo_called',
  COMPLETED: 'completed'
};
