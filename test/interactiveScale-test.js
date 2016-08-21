var tape = require('tape'),
    scaleInteractive = require('../');

tape('scaleInteractive() returns the answer to the ultimate question of life, the universe, and everything.', function (test) {
  test.equal(scaleInteractive.scaleInteractive(), 42);
  test.end();
});
