/**
 * @file FreeBasic grammar for tree-sitter
 * @author Ra77a3l3-jar <raffaelemeo77@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

const PREC = {
  DEFAULT: 0,
  LOGICAL_OR: 1,
  LOGICAL_AND: 2,
  LOGICAL_NOT: 3,
  RELATIONAL: 4,
  ADD: 5,
  MULTIPLY: 6,
  UNARY: 7,
  POWER: 8,
  CALL: 9,
  MEMBER: 10,
};

module.exports = grammar({
  name: 'freebasic',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.return_statement],
    [$.print_statement],
    [$.for_statement],
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.dim_statement,
      $.assignment_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.do_statement,
      $.sub_declaration,
      $.function_declaration,
      $.return_statement,
      $.print_statement,
      $.input_statement,
      $.sleep_statement,
      $.call_statement,
      $.comment,
    ),

    dim_statement: $ => seq(
      field('keyword', alias(/[Dd][Ii][Mm]/, 'DIM')),
      field('name', $.identifier),
      optional(seq(
        alias(/[Aa][Ss]/, 'AS'),
        field('type', $.type_identifier)
      )),
      optional(seq(
        '=',
        field('value', $.expression)
      ))
    ),

    assignment_statement: $ => seq(
      field('left', $.identifier),
      '=',
      field('right', $.expression)
    ),

    if_statement: $ => seq(
      field('keyword', alias(/[Ii][Ff]/, 'IF')),
      field('condition', $.expression),
      alias(/[Tt][Hh][Ee][Nn]/, 'THEN'),
      repeat($._statement),
      optional(seq(
        alias(/[Ee][Ll][Ss][Ee]/, 'ELSE'),
        repeat($._statement)
      )),
      alias(/[Ee][Nn][Dd]\s+[Ii][Ff]/, 'END IF')
    ),

    while_statement: $ => seq(
      alias(/[Ww][Hh][Ii][Ll][Ee]/, 'WHILE'),
      field('condition', $.expression),
      repeat($._statement),
      alias(/[Ww][Ee][Nn][Dd]/, 'WEND')
    ),

    for_statement: $ => seq(
      alias(/[Ff][Oo][Rr]/, 'FOR'),
      field('variable', $.identifier),
      '=',
      field('start', $.expression),
      alias(/[Tt][Oo]/, 'TO'),
      field('end', $.expression),
      optional(seq(
        alias(/[Ss][Tt][Ee][Pp]/, 'STEP'),
        field('step', $.expression)
      )),
      repeat($._statement),
      alias(/[Nn][Ee][Xx][Tt]/, 'NEXT'),
      optional($.identifier)
    ),

    do_statement: $ => seq(
      alias(/[Dd][Oo]/, 'DO'),
      repeat($._statement),
      alias(/[Ll][Oo][Oo][Pp]/, 'LOOP'),
      optional(seq(
        alias(/[Uu][Nn][Tt][Ii][Ll]/, 'UNTIL'),
        field('condition', $.expression)
      ))
    ),

    sub_declaration: $ => seq(
      alias(/[Ss][Uu][Bb]/, 'SUB'),
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      repeat($._statement),
      alias(/[Ee][Nn][Dd]\s+[Ss][Uu][Bb]/, 'END SUB')
    ),

    function_declaration: $ => seq(
      alias(/[Ff][Uu][Nn][Cc][Tt][Ii][Oo][Nn]/, 'FUNCTION'),
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      optional(seq(
        alias(/[Aa][Ss]/, 'AS'),
        field('return_type', $.type_identifier)
      )),
      repeat($._statement),
      alias(/[Ee][Nn][Dd]\s+[Ff][Uu][Nn][Cc][Tt][Ii][Oo][Nn]/, 'END FUNCTION')
    ),

    parameter_list: $ => sep1($.parameter, ','),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq(
        alias(/[Aa][Ss]/, 'AS'),
        field('type', $.type_identifier)
      ))
    ),

    return_statement: $ => seq(
      alias(/[Rr][Ee][Tt][Uu][Rr][Nn]/, 'RETURN'),
      optional($.expression)
    ),

    print_statement: $ => seq(
      alias(/[Pp][Rr][Ii][Nn][Tt]/, 'PRINT'),
      optional(sep1($.expression, choice(',', ';')))
    ),

    input_statement: $ => seq(
      alias(/[Ii][Nn][Pp][Uu][Tt]/, 'INPUT'),
      optional(seq(
        $.string_literal,
        choice(',', ';')
      )),
      $.identifier
    ),

    sleep_statement: $ => alias(/[Ss][Ll][Ee][Ee][Pp]/, 'SLEEP'),

    call_statement: $ => $.call_expression,

    expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.parenthesized_expression,
      $.identifier,
      $.number_literal,
      $.string_literal,
    ),

    binary_expression: $ => choice(
      prec.left(PREC.LOGICAL_OR, seq(
        field('left', $.expression),
        field('operator', alias(/[Oo][Rr]/, 'OR')),
        field('right', $.expression)
      )),
      prec.left(PREC.LOGICAL_AND, seq(
        field('left', $.expression),
        field('operator', alias(/[Aa][Nn][Dd]/, 'AND')),
        field('right', $.expression)
      )),
      prec.left(PREC.RELATIONAL, seq(
        field('left', $.expression),
        field('operator', choice('=', '<>', '<', '>', '<=', '>=')),
        field('right', $.expression)
      )),
      prec.left(PREC.ADD, seq(
        field('left', $.expression),
        field('operator', choice('+', '-')),
        field('right', $.expression)
      )),
      prec.left(PREC.MULTIPLY, seq(
        field('left', $.expression),
        field('operator', choice('*', '/', alias(/[Mm][Oo][Dd]/, 'MOD'))),
        field('right', $.expression)
      )),
      prec.right(PREC.POWER, seq(
        field('left', $.expression),
        field('operator', '^'),
        field('right', $.expression)
      )),
    ),

    unary_expression: $ => prec(PREC.UNARY, seq(
      field('operator', choice('-', alias(/[Nn][Oo][Tt]/, 'NOT'))),
      field('operand', $.expression)
    )),

    call_expression: $ => prec(PREC.CALL, seq(
      field('function', $.identifier),
      '(',
      optional(sep1($.expression, ',')),
      ')'
    )),

    parenthesized_expression: $ => seq('(', $.expression, ')'),

    type_identifier: $ => choice(
      alias(/[Ii][Nn][Tt][Ee][Gg][Ee][Rr]/, 'INTEGER'),
      alias(/[Ss][Tt][Rr][Ii][Nn][Gg]/, 'STRING'),
      alias(/[Dd][Oo][Uu][Bb][Ll][Ee]/, 'DOUBLE'),
      alias(/[Ss][Ii][Nn][Gg][Ll][Ee]/, 'SINGLE'),
      alias(/[Bb][Yy][Tt][Ee]/, 'BYTE'),
      alias(/[Ll][Oo][Nn][Gg]/, 'LONG'),
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number_literal: $ => /\d+(\.\d+)?/,

    string_literal: $ => /"[^"]*"/,

    comment: $ => choice(
      seq("'", /.*/),
      seq(/[Rr][Ee][Mm]/, /.*/)
    ),
  },
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
