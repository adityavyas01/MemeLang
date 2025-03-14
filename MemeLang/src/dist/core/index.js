export * from './types';
export * from './errors';
export * from './lexer';
export * from './parser';
export * from './interpreter';
export * from './executor';
// Version information
export const VERSION = '1.0.0';
// Language configuration
export const CONFIG = {
    keywords: {
        START: 'hi_bhai',
        END: 'bye_bhai',
        PRINT: 'bol_bhai',
        IF: 'agar_bhai',
        ELSE: 'warna_bhai',
        LOOP: 'ghoom_bhai',
        BREAK: 'bas_bhai',
        CONTINUE: 'agla_bhai',
        FUNCTION: 'bana_bhai',
        RETURN: 'wapas_bhai',
        CLASS: 'class_bana',
        EXTENDS: 'extend_kar',
        NEW: 'new_bhai',
        THIS: 'ye_le_bhai',
        NULL: 'null_hai',
        TRUE: 'sahi_hai',
        FALSE: 'galat_hai'
    },
    maxLoopIterations: 1000,
    maxRecursionDepth: 100,
    maxStringLength: 10000
};
