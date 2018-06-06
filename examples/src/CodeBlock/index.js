import React, { Component, Fragment } from 'react';
import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import * as themes from './themes';

type Props = { children: Node, style?: Object, theme: 'dark' | 'light' };

const CodeBlock = ({ children, style, theme = 'light', ...props }: Props) => {
  return (
    <SyntaxHighlighter
      language="jsx"
      style={themes[theme]}
      // useInlineStyles={false}
      customStyle={style}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
};
export default CodeBlock;
