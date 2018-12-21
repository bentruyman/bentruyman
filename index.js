#!/usr/bin/env node
'use strict';

const c = require('kleur');

const pkg = require('./package.json');

const IS_MACOS = require('os').platform() === 'darwin';
const R_ANSI = /\u001b\[\d+m/gm;

const NEWLINE = '\n';
const SPACE = ' ';

const COLORS = ['blue', 'green', 'red', 'yellow'];
const COLOR = c[pickOne(COLORS)];

const TOP_LEFT_CORNER = '┏';
const TOP_RIGHT_CORNER = '┓';
const BOTTOM_LEFT_CORNER = '┗';
const BOTTOM_RIGHT_CORNER = '┛';
const HORIZONTAL_BORDER = '┃';
const VERTICAL_BORDER = '━';

const HORIZONTAL_MARGIN = 2;
const VERTICAL_MARGIN = 1;
const HORIZONTAL_PADDING = 3;
const VERTICAL_PADDING = 1;

render([
  COLOR().bold(pkg.author.name),
  IS_MACOS ? `${c.white('')} ${c.dim('Lead Developer')}` : c.dim('Lead Developer at Apple'),
  '',
  c.bold(pkg.author.email),
  '',
  c.underline('https://bentruyman.com/'),
  c.underline('https://github.com/bentruyman'),
  c.underline('https://twitter.com/bentruyman')
]);

function render (lines) {
  const unstyled = lines.map(removeStyles);
  const width = unstyled.reduce(findLongest, '').length;

  const borders = createBorders(width);

  const emptyLine = `${borders.left}${fill(SPACE, width)}${borders.right}`;

  const horizontalMargin = fill(SPACE, HORIZONTAL_MARGIN);
  const verticalMargin = fill(NEWLINE, VERTICAL_MARGIN);
  const verticalPadding = fill(emptyLine, VERTICAL_PADDING);

  const wrapped = lines
    .map(normalizeWidth(width, unstyled))
    .map(wrapLine(borders.left, borders.right));

  const boxLines = [
    verticalMargin,
    ...[
      borders.top,
      verticalPadding,
      ...wrapped,
      verticalPadding,
      borders.bottom
    ].map(prefix(horizontalMargin)),
    verticalMargin
  ];

  console.log(boxLines.join(NEWLINE));
}

function createBorders (width) {
  const horizontalPadding = fill(SPACE, HORIZONTAL_PADDING);
  const styledBorder = COLOR(HORIZONTAL_BORDER);
  const left = `${styledBorder}${horizontalPadding}`;
  const right = `${horizontalPadding}${styledBorder}`;

  const horizontalBar = fill(VERTICAL_BORDER, HORIZONTAL_PADDING * 2 + width);
  const top = `${COLOR(`${TOP_LEFT_CORNER}${horizontalBar}${TOP_RIGHT_CORNER}`)}`;
  const bottom = `${COLOR(`${BOTTOM_LEFT_CORNER}${horizontalBar}${BOTTOM_RIGHT_CORNER}`)}`;

  return { left, right, top, bottom };
}

function fill (char, amount) {
  return (new Array(amount + 1)).join(char);
}

function findLongest (a, b) {
  return a.length > b.length ? a : b;
}

function pickOne (items) {
  return items[Math.floor(Math.random() * COLORS.length)];
}

function normalizeWidth (width, unstyled) {
  return (line, index) => `${line}${fill(SPACE, width - unstyled[index].length)}`;
}

function prefix (str) {
  return line => `${str}${line}`;
}

function removeStyles (str) {
  return str.replace(R_ANSI, '');
}

function wrapLine (left, right) {
  return line => `${left}${line}${right}`;
}
