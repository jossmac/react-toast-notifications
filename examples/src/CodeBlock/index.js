import React, { Component, Fragment } from 'react';
import styled from 'react-emotion';
import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import * as themes from './themes';

export const CodeExample = styled.div({
  maxWidth: '100%',

  [`@media (min-width: 740px)`]: {
    maxHeight: '55vh',
    width: '55%',
  },
});

type Props = { children: Node, style?: Object, theme: 'dark' | 'light' };

const CodeBlock = ({ children, style, theme = 'light', ...props }: Props) => {
  return (
    <CodeExample>
      <SyntaxHighlighter
        language="jsx"
        style={themes[theme]}
        // useInlineStyles={false}
        customStyle={style}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </CodeExample>
  );
};
export default CodeBlock;
