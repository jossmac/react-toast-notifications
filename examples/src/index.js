import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import {
  Anchor,
  Code,
  Container,
  Footer,
  Header,
  Icon,
  Repo,
  Title,
} from './styled';
import './index.css';
import { ToastProvider, withToastUtils } from '../../src';

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

const appearances = ['Info', 'Success', 'Error'];

class ToastButtons extends Component {
  state = { autoDismiss: true };
  toggle = event => this.setState({ autoDismiss: event.target.checked });
  render() {
    const { toast } = this.props;
    const { autoDismiss } = this.state;
    return (
      <div css={{ marginBottom: '1em', marginTop: '1em' }}>
        {appearances.map(a => {
          const appearance = a.toLowerCase();
          const onClick = toast.addToast(getRandom(), {
            appearance,
            autoDismiss,
          });

          return (
            <button key={a} onClick={onClick}>
              {a}
            </button>
          );
        })}
        <div
          css={{
            alignItems: 'center',
            display: 'flex',
            fontSize: '0.75em',
            justifyContent: 'center',
            marginTop: '1em',
          }}
        >
          <input
            id="auto-dismiss-checkbox"
            type="checkbox"
            onChange={this.toggle}
            style={{ marginRight: '0.5em' }}
            checked={autoDismiss}
          />
          <label htmlFor="auto-dismiss-checkbox">Auto-dismiss</label>
        </div>
      </div>
    );
  }
}

const Toasts = withToastUtils(ToastButtons);

// example
// ------------------------------

class App extends Component {
  state = { paragraph: null };
  toggle = () => {
    const paragraph = getRandom();
    this.setState(state => ({ paragraph: state.paragraph ? null : paragraph }));
  };
  update = () => {
    const paragraph = getRandom();
    this.setState({ paragraph });
  };
  render() {
    const { paragraph } = this.state;
    return (
      <ToastProvider>
        <Container>
          <div>
            <Header>
              <Icon role="img" className="animate-dropin">
                🍞
              </Icon>
              <Title>
                Let users know what&apos;s happening in your app with{' '}
                <Repo href="https://github.com/jossmac/react-toast-notifications">
                  react-toast-notifications
                </Repo>
              </Title>
            </Header>

            <Toasts />

            <Footer>
              <span> by </span>
              <a href="https://twitter.com/jossmackison" target="_blank">
                @jossmac
              </a>{' '}
              &middot; paragraphs from{' '}
              <a href="http://www.cupcakeipsum.com" target="_blank">
                Cupcake Ipsum
              </a>
            </Footer>
          </div>
        </Container>
      </ToastProvider>
    );
  }
}

// render
// ------------------------------

render(<App />, document.getElementById('root'));
