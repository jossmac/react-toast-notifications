import React, { Component, Fragment } from 'react';
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
  // CodeBlock,
  CodeExample,
  StretchGroup,
} from './styled';
import CodeBlock from './CodeBlock';
import './index.css';
import ConnectivityListener from './ConnectivityListener';
import { ToastProvider, ToastConsumer, withToastManager } from '../../src';
import exampleText from 'raw-loader!./raw/example';

const snackStates = {
  entering: { transform: 'translate3d(0,110%,0)' },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: 'translate3d(0,110%,0)' },
  exited: { transform: 'translate3d(0,110%,0)' },
};
const Snack = ({
  appearance,
  children,
  transitionDuration,
  transitionState,
  onDismiss,
}) => {
  console.log('onDismiss', onDismiss);
  return (
    <div
      css={{
        backgroundColor: '#444',
        borderRadius: 4,
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
        transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1)`,
        ...snackStates[transitionState],
      }}
    >
      <span css={{ flex: 1 }}>{children}</span>
      <div onClick={onDismiss} role="button">
        DISMISS
      </div>
    </div>
  );
};

const exampleCode = ({
  appearance,
  autoDismiss,
  toastContent,
}) => `import { withToastManager } from 'react-toast-notifications';

const Demo = ({ content, toastManager }) => (
  <Button onClick={toastManager.add(content, {
    appearance: '${appearance}',
    autoDismiss: ${autoDismiss},
  })}>
    Add Toast
  </Button>
);

export const ToastDemo = withToastManager(Demo);`;

// data
// ------------------------------

const paragraphArray = [
  'Amet soufflé carrot cake tootsie roll jelly-o chocolate cake.',
  'Chocolate bar gummies sweet roll macaroon powder sweet tart croissant.',
  'Pastry ice cream bear claw cupcake topping caramels jelly beans chocolate cheesecake. Candy canes pastry cake tart powder.',
  'Tootsie roll bear claw sesame snaps candy cheesecake caramels cookie.',
  'Lemon drops donut marzipan gummi bears cotton candy cotton candy jelly-o carrot cake.',
  'Lemon drops pastry apple pie biscuit tart tootsie roll.',
  'Brownie icing chupa chups cake cookie halvah gummi bears halvah.',
  'Sesame snaps donut gingerbread marshmallow topping powder.',
  'Biscuit chocolate cheesecake pudding candy canes tart halvah sweet.',
  'Sugar plum cake candy carrot cake.',
  'Ice cream marzipan liquorice candy canes sesame snaps danish soufflé lollipop candy canes. Lemon drops cotton candy pudding.',
  'Pie cake soufflé cupcake jujubes sugar plum. Liquorice lollipop oat cake.',
];

function getRandom() {
  const index = Math.floor(Math.random() * paragraphArray.length);
  return paragraphArray[index];
}

// Toast Buttons
// ------------------------------

const appearances = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
];

class ToastButtons extends Component {
  state = {
    appearance: appearances[0].value,
    autoDismiss: true,
    toastContent: getRandom(),
  };
  toggleAutoDismiss = event => {
    this.setState({ autoDismiss: event.target.checked });
  };
  add = () => {
    const { toastManager } = this.props;
    const { appearance, autoDismiss } = this.state;

    toastManager.add(getRandom(), {
      appearance,
      autoDismiss,
    });
  };
  handleAppearanceChange = appearance => {
    this.setState({ appearance });
  };
  render() {
    const { appearance, autoDismiss } = this.state;
    return (
      <StretchGroup>
        <ContentBlock align="left">
          <Title tag="h1">
            Let users know what&apos;s happening in your app.
          </Title>
          <div css={{ marginBottom: '1em', marginTop: '1em' }}>
            <RadioGroup
              value={this.state.appearance}
              onChange={this.handleAppearanceChange}
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
          <div css={{ alignItems: 'center', display: 'flex' }}>
            <Button appearance={appearance} onClick={this.add}>
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
                onChange={this.toggleAutoDismiss}
                style={{ marginRight: '0.5em' }}
                checked={autoDismiss}
              />
              <label htmlFor="auto-dismiss-checkbox">Auto-dismiss</label>
            </div>
          </div>
        </ContentBlock>
        <CodeExample>
          <CodeBlock>{exampleCode(this.state)}</CodeBlock>
        </CodeExample>
      </StretchGroup>
    );
  }
}

const Toasts = withToastManager(ToastButtons);

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
              <span>react-toast-notifications</span>
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
              <span>for </span>
              <a href="http://keystonejs.com" target="_blank">
                KeystoneJS
              </a>{' '}
              on{' '}
              <a
                href="https://www.npmjs.com/package/react-toast-notifications"
                target="_blank"
              >
                npm
              </a>
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
        <ToastProvider components={{ Toast: Snack }}>
          <Container>
            {/* <Repo href={repoUrl}>
            <Icon role="img">🚀</Icon>
            <span>Configuration</span>
          </Repo> */}

            <Body>
              <div
                css={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <CodeExample>
                  <CodeBlock theme="dark">{`import { ToastProvider } from 'react-toast-notifications';
import { MyCustomToast } from '../toasts';

const App = () => (
  <ToastProvider
    autoDismissTimeout={3000}
    components={{ Toast: MyCustomToast }}
    placement="bottom-center"
  >
    ...
  </ToastProvider>
);
`}</CodeBlock>
                </CodeExample>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    paddingLeft: '2em',
                  }}
                >
                  <Title>Make it your own.</Title>
                  <div>
                    <p>
                      Replace or configure any part of the notification system.
                    </p>
                    <p>
                      <ToastConsumer>
                        {({ add }) => (
                          <Button
                            appearance="snack"
                            onClick={() => add('snack', { appearance: 'info' })}
                          >
                            Snack?
                          </Button>
                        )}
                      </ToastConsumer>
                    </p>
                  </div>
                </div>
              </div>
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
            <div
              css={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingRight: '2em',
                }}
              >
                <Title>Let&apos;s get real.</Title>
                <div>
                  <p>
                    You&apos;re probably not firing off notifications
                    haphazardly, from buttons in your app.
                  </p>
                  <p>
                    To see an example of how you might use this IRL, toggle the{' '}
                    <code>Offline</code> checkbox in the Network pane of your
                    dev tools.
                  </p>
                </div>
              </div>
              <CodeExample>
                <CodeBlock>{exampleText}</CodeBlock>
              </CodeExample>
            </div>
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
      </Section>
    </ToastProvider>
  );
}

// render
// ------------------------------

render(<App />, document.getElementById('root'));
