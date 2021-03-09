import React from 'react';
import renderer from 'react-test-renderer';
import Wallet from '../Wallet';
import {
    walletWithBalancesAndTokens,
    walletWithBalancesMock,
    walletWithoutBalancesMock,
} from '../__mocks__/walletAndBalancesMock';
import { BrowserRouter as Router } from 'react-router-dom';

let realUseContext;
let useContextMock;

beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
});

afterEach(() => {
    React.useContext = realUseContext;
});

test('Wallet without BCH balance', () => {
    useContextMock.mockReturnValue(walletWithoutBalancesMock);
    const component = renderer.create(
        <Router>
            <Wallet />
        </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Wallet with BCH balances', () => {
    useContextMock.mockReturnValue(walletWithBalancesMock);
    const component = renderer.create(
        <Router>
            <Wallet />
        </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Wallet with BCH balances and tokens', () => {
    useContextMock.mockReturnValue(walletWithBalancesAndTokens);
    const component = renderer.create(
        <Router>
            <Wallet />
        </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Without wallet defined', () => {
    useContextMock.mockReturnValue({
        wallet: {},
        balances: { totalBalance: 0 },
    });
    const component = renderer.create(
        <Router>
            <Wallet />
        </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
