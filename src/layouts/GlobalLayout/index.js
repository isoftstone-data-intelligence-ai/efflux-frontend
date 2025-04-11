import React from 'react';
import { StoreProvider } from '@/utils/redux/StoreProvider';
import ThemeProvider from './ThemeProvider';
import ContProvider from './ContProvider';

export default class BasicLayout extends React.Component {
  render() {
    return (
      <StoreProvider>
        <ContProvider>
          <ThemeProvider>{this.props.children}</ThemeProvider>
        </ContProvider>
      </StoreProvider>
    );
  }
}
