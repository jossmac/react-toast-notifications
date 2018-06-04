import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { RadioGroup, Radio } from 'react-radios';

import {
  Anchor,
  Body,
  Button,
  Code,
  Container,
  Footer,
  Header,
  Icon,
  Repo,
  Title,
  GithubLogo,
  CodeBlock,
  CodeExample,
} from './styled';
import './index.css';
import ConnectivityListener from './ConnectivityListener';
import { ToastProvider, withToastManager } from '../../src';

const exampleCode = ({
  appearance,
  autoDismiss,
  toastContent,
}) => `import { ToastProvider, withToastManager } from 'react-toast-notifications';

const Demo = ({ toastContent, toastManager }) => (
  <Button onClick={toastManager.add(toastContent, {
    appearance: '${appearance}',
    autoDismiss: ${autoDismiss},
  })}>
    Add Toast
  </Button>
);

const ToastDemo = withToastManager(Demo);

const App = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);`;

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
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: '1em',
          }}
        >
          <Title>Let users know what&apos;s happening in your app.</Title>
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
        </div>
        <CodeExample>
          <CodeBlock>{exampleCode(this.state)}</CodeBlock>
        </CodeExample>
      </div>
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
            <a href="https://twitter.com/keystonejs" target="_blank">
              @keystonejs
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
    </ToastProvider>
  );
}

// render
// ------------------------------

render(<App />, document.getElementById('root'));
