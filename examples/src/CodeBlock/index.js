/** @jsx jsx */

import { jsx } from '@emotion/core';
import React, { Component, Fragment } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism-light';
import * as themes from './themes';

export const CodeExample = props => (
  <div
    css={{
      maxWidth: '100%',

      [`@media (min-width: 740px)`]: {
        maxHeight: '55vh',
        width: '55%',
      },
    }}
    {...props}
  />
);

type Props = { children: Node, style?: Object, theme: 'dark' | 'light' };

const CodeBlock = ({ children, style, theme = 'light', ...props }: Props) => {
  return (
    <CodeExample>
      <SyntaxHighlighter
        language="jsx"
        style={themes[theme]}
        customStyle={style}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </CodeExample>
  );
};
export default CodeBlock;
