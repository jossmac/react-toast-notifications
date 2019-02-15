import React, { Component, Fragment, useState } from 'react';
import { render } from 'react-dom';
import { RadioGroup, Radio } from 'react-radios';

import {
  Anchor,
  Body,
  Button,
  Code,
  Container,
  ContentBlock,
  Section,
  Footer,
  Header,
  Icon,
  Repo,
  Title,
  GithubLogo,
  StretchGroup,
} from './styled';
import CodeBlock from './CodeBlock';
import './index.css';
import ConnectivityListener from './ConnectivityListener';
import { ToastProvider, ToastConsumer, withToastManager, useToasts } from '../../src';
import * as colors from '../../src/colors';
import exampleText from 'raw-loader!./raw/example';

const snackStates = {
  entering: { transform: 'translate3d(0, 120%, 0) scale(0.9)' },
  entered: { transform: 'translate3d(0, 0, 0) scale(1)' },
  exiting: { transform: 'translate3d(0, 120%, 0) scale(0.9)' },
  exited: { transform: 'translate3d(0, 120%, 0) scale(0.9)' },
};
const Snack = ({
  appearance,
  children,
  transitionDuration,
  transitionState,
  onDismiss,
}) => {
  return (
    <div
      css={{
        alignItems: 'center',
        backgroundColor: 'rgb(49, 49, 49)',
        borderRadius: 2,
        boxShadow: `
          0px 3px 5px -1px rgba(0, 0, 0, 0.2),
          0px 6px 10px 0px rgba(0, 0, 0, 0.14),
          0px 1px 18px 0px rgba(0, 0, 0, 0.12)`,
        color: '#fff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        fontFamily: 'Roboto',
        // marginBottom: 8,
        minWidth: 288,
        maxWidth: 568,
        padding: '6px 24px',
        pointerEvents: 'initial',
        transitionProperty: `transform`,
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: `cubic-bezier(0.2, 0, 0, 1)`,
        transformOrigin: 'bottom',
        zIndex: 2,
        ...snackStates[transitionState],
      }}
    >
      <div css={{ fontSize: '0.875rem', padding: '8px 0' }}>{children}</div>
      <div
        onClick={onDismiss}
        role="button"
        css={{
          color: colors.P100,
          cursor: 'pointer',
          fontSize: '0.8125rem',
          marginLeft: 'auto',
          padding: '7px 8px',
          textTransform: 'uppercase',
        }}
      >
        Undo
      </div>
    </div>
  );
};

const exampleCode = ({
  appearance,
  autoDismiss,
  codeStyle,
}) => codeStyle === 'hoc' ? `import { withToastManager } from 'react-toast-notifications';

const Demo = ({ content, toastManager }) => (
  <Button onClick={() => toastManager.add(content, {
    appearance: '${appearance}',
    autoDismiss: ${autoDismiss},
  })}>
    Add Toast
  </Button>
);

export const ToastDemo = withToastManager(Demo);` : `import { useToasts } from 'react-toast-notifications';

export const ToastDemo = ({ content }) => {
  const toasts = useToasts()
  return (
    <Button onClick={() => toasts.add(content, {
      appearance: '${appearance}',
      autoDismiss: ${autoDismiss},
    })}>
      Add Toast
    </Button>
  );
};
`;

// data
// ------------------------------

const paragraphArray = [
  'Amet soufflé carrot cake tootsie roll jelly-o chocolate cake.',
  'Chocolate bar gummies sweet roll macaroon powder sweet tart croissant.',
  'Pastry ice cream bear claw cupcake topping caramels jelly beans chocolate cheesecake.',
  'Candy canes pastry cake tart powder.',
  'Tootsie roll bear claw sesame snaps candy cheesecake caramels cookie.',
  'Lemon drops donut marzipan gummi bears cotton candy cotton candy jelly-o carrot cake.',
  'Lemon drops pastry apple pie biscuit tart tootsie roll.',
  'Brownie icing chupa chups cake cookie halvah gummi bears halvah.',
  'Sesame snaps donut gingerbread marshmallow topping powder.',
  'Biscuit chocolate cheesecake pudding candy canes tart halvah sweet.',
  'Sugar plum cake candy carrot cake.',
  'Ice cream marzipan liquorice candy canes sesame snaps danish soufflé lollipop candy canes.',
  'Lemon drops cotton candy pudding.',
  'Pie cake soufflé cupcake jujubes sugar plum.',
  'Liquorice lollipop oat cake.',
];

function getRandom() {
  const index = Math.floor(Math.random() * paragraphArray.length);
  return paragraphArray[index];
}

// Toast Buttons
// ------------------------------

const appearances = [
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
];
const codeStyles = [
  { value: 'hoc', label: 'Use HOC' },
  { value: 'hook', label: 'Use Hooks' },
];

function Toasts() {
  const [appearance, setAppearance] = useState(appearances[0].value);
  const [codeStyle, setCodeStyle] = useState(codeStyles[0].value);
  const [autoDismiss, setAutoDismiss] = useState(false);
  const toasts = useToasts();

  const state = { appearance, autoDismiss, codeStyle};
  const toggleAutoDismiss = event => setAutoDismiss(event.target.checked);
  const add = () => toasts.add(getRandom(), { appearance, autoDismiss });
  const handleAppearanceChange = appearance => setAppearance(appearance);
  const handleCodeStyleChange = e => setCodeStyle(e);

  return (
    <StretchGroup>
      <ContentBlock align="left">
        <Title tag="h1">
          Let users know what&apos;s happening in your app.
        </Title>
        <div css={{ marginBottom: '1em', marginTop: '1em' }}>
          <RadioGroup
            value={appearance}
            onChange={handleAppearanceChange}
          >
            {appearances.map(a => (
              <label
                key={a.value}
                css={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  marginRight: '1em',
                }}
              >
                <Radio value={a.value} />
                <div css={{ marginLeft: '0.25em' }}>{a.label}</div>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div css={{ marginBottom: '1em', marginTop: '1em' }}>
          <RadioGroup
            value={codeStyle}
            onChange={handleCodeStyleChange}
          >
            {codeStyles.map(a => (
              <label
                key={a.value}
                css={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  marginRight: '1em',
                }}
              >
                <Radio value={a.value} />
                <div css={{ marginLeft: '0.25em' }}>{a.label}</div>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div css={{ alignItems: 'center', display: 'flex' }}>
          <Button appearance={appearance} onClick={add}>
            Add Toast
          </Button>
          <div
            css={{
              alignItems: 'center',
              display: 'flex',
              fontSize: '0.85em',
              marginLeft: '1em',
            }}
          >
            <input
              id="auto-dismiss-checkbox"
              type="checkbox"
              onChange={toggleAutoDismiss}
              style={{ marginRight: '0.5em' }}
              checked={autoDismiss}
            />
            <label htmlFor="auto-dismiss-checkbox">Auto-dismiss</label>
          </div>
        </div>
      </ContentBlock>
      <CodeBlock>{exampleCode(state)}</CodeBlock>
    </StretchGroup>
  );
}

// example
// ------------------------------

function App() {
  const repoUrl = 'https://github.com/jossmac/react-toast-notifications';
  return (
    <ToastProvider>
      <ConnectivityListener />
      <Section area="intro">
        <Container>
          <Header>
            <Repo href={repoUrl}>
              <Icon role="img">🍞</Icon>
              <span>React Toast Notifications</span>
            </Repo>
            <GithubLogo href={repoUrl} target="_blank" />
          </Header>

          <Body>
            <Toasts />
          </Body>

          <Footer>
            <div>
              <span>by </span>
              <a href="https://twitter.com/jossmackison" target="_blank">
                @jossmac
              </a>{' '}
              {/* <span>for </span>
              <a href="http://keystonejs.com" target="_blank">
                KeystoneJS
              </a>{' '}
              on{' '}
              <a
                href="https://www.npmjs.com/package/react-toast-notifications"
                target="_blank"
              >
                npm
              </a> */}
            </div>
            <div>
              paragraphs from{' '}
              <a href="http://www.cupcakeipsum.com" target="_blank">
                Cupcake Ipsum
              </a>{' '}
            </div>
          </Footer>
        </Container>
      </Section>
      {/*
        ==============================
        CONFIGURATION
        ==============================
      */}
      <Section area="config">
        <ToastProvider components={{ Toast: Snack }} placement="bottom-center">
          <Container>
            <Body>
              <StretchGroup reverse>
                <ContentBlock align="right">
                  <Title>Make it your own.</Title>
                  <div>
                    <p>
                      Replace or configure any part of the notification system.
                    </p>
                    <ToastConsumer>
                      {({ add, toasts }) => (
                        <Button
                          appearance="snack"
                          isDisabled={toasts.length}
                          onClick={
                            toasts.length
                              ? null
                              : () => add(getRandom(), { autoDismiss: 6000 })
                          }
                        >
                          Snackbar
                        </Button>
                      )}
                    </ToastConsumer>
                  </div>
                </ContentBlock>
                <CodeBlock theme="dark">{`import { ToastProvider } from 'react-toast-notifications';
import { MyCustomToast } from '../snackbar';

const App = () => (
  <ToastProvider
    autoDismissTimeout={6000}
    components={{ Toast: MyCustomToast }}
    placement="bottom-center"
  >
    ...
  </ToastProvider>
);
`}</CodeBlock>
              </StretchGroup>
            </Body>

            {/* <Footer>
            <div>
              <span>by </span>
              <a href="https://twitter.com/jossmackison" target="_blank">
                @jossmac
              </a>
            </div>
          </Footer> */}
          </Container>
        </ToastProvider>
      </Section>
      {/*
        ==============================
        CONFIGURATION
        ==============================
      */}
      <Section area="example">
        <Container>
          {/* <Repo href={repoUrl}>
            <Icon role="img">🚀</Icon>
            <span>Configuration</span>
          </Repo> */}

          <Body>
            <StretchGroup>
              <ContentBlock align="left">
                <Title>Let&apos;s get real.</Title>
                <div>
                  <p>
                    You&apos;re probably not firing off notifications
                    haphazardly, from some random buttons in your app.*
                  </p>
                  <p>
                    To see an example of how you might use this IRL, toggle the{' '}
                    <code>Offline</code> checkbox in the Network pane of your
                    dev tools.
                  </p>
                  <p>
                    <small>* It's totally cool if you are, no judgement.</small>
                  </p>
                </div>
              </ContentBlock>
              <CodeBlock>{exampleText}</CodeBlock>
            </StretchGroup>
          </Body>
        </Container>
      </Section>
    </ToastProvider>
  );
}

// render
// ------------------------------

render(<App />, document.getElementById('root'));
