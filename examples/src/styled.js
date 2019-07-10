/** @jsx jsx */

import { jsx } from '@emotion/core';
import React, { Component, Fragment } from 'react';
import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/prism-light';
import jsxGrammar from 'react-syntax-highlighter/languages/prism/jsx';
import * as colors from '../../src/colors';

registerLanguage('jsx', jsxGrammar);

const gutter = 15;
const containerWidth = 1140;

// styled components
// ------------------------------

const sections = {
  intro: { bg: [colors.N10, colors.N20], text: 'inherit' },
  config: { bg: [colors.N700, colors.N800], text: 'white' },
  example: { bg: [colors.N10, colors.N20], text: 'inherit' },
};

export const Section = ({ area, ...props }) => {
  const theme = sections[area];
  return (
    <section
      css={{
        background: `linear-gradient(to bottom right, ${theme.bg.join(
          ','
        )}) no-repeat left top`,
        color: theme.text,
      }}
      {...props}
    />
  );
};

export const Container = props => (
  <div
    css={{
      boxSizing: 'border-box',
      display: 'flex ',
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: containerWidth,
      minHeight: '100vh',
      padding: '30px 15px',

      '@media (min-width: 480px)': {
        padding: '30px',
      },
    }}
    {...props}
  />
);
export const Body = props => (
  <div
    css={{
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      marginBottom: '1em',
      marginTop: '1em',
    }}
    {...props}
  />
);
const buttonBg = {
  info: [colors.B100, colors.B200],
  success: [colors.G200, colors.G300],
  error: [colors.R300, colors.R400],
  warning: [colors.Y300, colors.Y400],
  snack: [colors.P300, colors.P400],
};

export const Button = ({ appearance, isDisabled, ...props }) => (
  <button
    css={{
      background: `linear-gradient(to bottom right, ${buttonBg[appearance].join(
        ','
      )}) no-repeat left top`,
      border: 0,
      borderRadius: 4,
      color: 'white',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: '2.2em',
      opacity: isDisabled ? '0.5' : null,
      paddingLeft: '1em',
      paddingRight: '1em',
      pointerEvents: isDisabled ? 'none' : null,
      transition:
        'box-shadow 150ms cubic-bezier(0.2, 0, 0, 1), transform 150ms cubic-bezier(0.2, 0, 0, 1)',

      ':hover, :focus': {
        outline: 0,
        boxShadow: '0 2px 1px rgba(9, 30, 66, 0.13)',
      },
      ':hover': { transform: 'scale(1.03)' },
      ':active': {
        transform: 'scale(0.97)',
        boxShadow: '0 0 0 rgba(9, 30, 66, 0.13)',
      },
    }}
    {...props}
  />
);

export const Repo = ({ isLocked, ...props }) => (
  <a
    target="_blank"
    css={{
      alignItems: 'center',
      display: 'flex',

      ':hover': {
        textDecoration: 'none',

        span: { borderBottomColor: '#B3BAC5' },
      },
      span: {
        borderBottom: '1px solid transparent',
        color: 'inherit',
        fontWeight: 500,
        paddingBottom: 1,
        textDecoration: 'none',
        transition: 'border-color 200ms',
      },
    }}
    {...props}
  />
);

/*
  ==============================
  Misc.
  ==============================
*/

export const Footer = props => (
  <footer
    css={{
      color: '#97A0AF',
      display: 'flex',
      fontSize: '0.85rem',
      justifyContent: 'space-between',
    }}
    {...props}
  />
);
export const Header = props => (
  <header
    css={{
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    }}
    {...props}
  />
);
export const Icon = props => (
  <div
    css={{
      fontSize: 32,
      height: 32,
      lineHeight: 1.2,
      marginRight: '0.5em',
      position: 'relative',
      width: 32,
    }}
    {...props}
  />
);
export const Title = ({ children, icon, tag: Tag = 'h2', ...props }) => (
  <Tag
    css={{
      fontSize: '2em',
      fontWeight: 'bold',
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
      margin: '0 0 1em',
    }}
  >
    {icon ? (
      <span css={{ position: 'absolute', transform: 'translateY(-100%)' }}>
        {icon}
      </span>
    ) : null}
    {children}
  </Tag>
);
export const ContentBlock = ({ align, ...props }) => {
  const map = { left: 'paddingRight', right: 'paddingLeft' };
  const padding = map[align];

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',

        [`@media (min-width: 740px)`]: {
          [padding]: '2em',
        },
        [`@media (max-width: 739px)`]: {
          paddingBottom: '2em',
        },
      }}
      {...props}
    />
  );
};
export const StretchGroup = ({ reverse, ...props }) => (
  <div
    css={{
      display: 'flex',
      flex: 1,
      flexDirection: reverse ? 'row-reverse' : 'row',
      maxWidth: '100%',

      [`@media (min-width: 740px)`]: {
        alignItems: 'stretch',
      },
      [`@media (max-width: 739px)`]: {
        flexDirection: 'column',
      },
    }}
    {...props}
  />
);
export const Code = props => (
  <code
    css={{
      backgroundColor: '#FFEBE5',
      borderRadius: '3px',
      color: '#BF2600',
      display: 'inline-block',
      fontFamily: 'Monaco',
      fontSize: '0.95em',
      lineHeight: '1.2',
      margin: '0 -0.2em',
      padding: '0 0.2em',
      position: 'relative',
      zIndex: -1,
    }}
    {...props}
  />
);

// Github Logo

export const GithubAnchor = props => (
  <a
    css={{
      color: '#97A0AF',
      transition: 'color 200ms',

      ':hover, :focus': {
        color: '#253858',
      },
    }}
    {...props}
  />
);
export const GithubLogo = props => (
  <GithubAnchor {...props}>
    <svg
      height="32"
      viewBox="0 0 16 16"
      version="1.1"
      width="32"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        style={{ fill: 'currentColor' }}
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  </GithubAnchor>
);
