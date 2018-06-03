import React, { Component, Fragment } from 'react';
import styled from 'react-emotion';
const gutter = 15;

// styled components
// ------------------------------

export const Container = props => (
  <div
    css={{
      display: 'flex ',
      flexDirection: 'column',
      minHeight: '100vh',
      boxSizing: 'border-box',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 410,
      padding: '60px 15px',
      textAlign: 'center',
    }}
    {...props}
  />
);

export const Repo = ({ isLocked, ...props }) => (
  <a
    target="_blank"
    css={{
      borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
      color: 'inherit',
      paddingBottom: 1,
      textDecoration: 'none',

      ':hover': {
        borderBottomColor: 'rgba(0, 0, 0, 0.6)',
        textDecoration: 'none',
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

export const Footer = styled.footer({ fontSize: 14 });
export const Header = styled.header({ marginBottom: '2em' });
export const Icon = styled.div({
  fontSize: 64,
  height: 64,
  lineHeight: 1,
  margin: '0 auto 0.5em',
  position: 'relative',
  width: 64,
});
export const Title = styled.h1({
  display: 'inline',
  fontSize: 'inherit',
  fontWeight: 500,
  letterSpacing: '-0.025em',
  margin: 0,
});
export const Code = styled.code({
  // backgroundColor: 'rgba(0, 0, 0, 0.09)',
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
});
