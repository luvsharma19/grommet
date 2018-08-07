import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import getDisplayName from 'recompose/getDisplayName';
import { ThemeContext as IconThemeContext } from 'grommet-icons';

import AnnounceContext from '../contexts/AnnounceContext';
import ThemeContext from '../contexts/ThemeContext';
import { deepMerge } from '../utils';

export const withFocus = (WrappedComponent) => {
  class FocusableComponent extends Component {
    static getDerivedStateFromProps(nextProps, prevState) {
      const { withFocusRef } = nextProps;
      const { wrappedRef } = prevState;
      const nextWrappedRef = withFocusRef || wrappedRef;
      if (nextWrappedRef !== wrappedRef) {
        return { wrappedRef: nextWrappedRef };
      }
      return null;
    }

    state = {
      focus: false,
      wrappedRef: React.createRef(),
    }

    componentDidMount = () => {
      const { wrappedRef } = this.state;

      // we could be using onFocus in the wrapper node itself
      // but react does not invoke it if you programically
      // call wrapperNode.focus() inside componentWillUnmount
      // see Drop "this.originalFocusedElement.focus();" for reference
      const wrapperNode = findDOMNode(wrappedRef.current);
      if (wrapperNode && wrapperNode.addEventListener) {
        wrapperNode.addEventListener('focus', this.setFocus);
      }
    }

    componentWillUnmount = () => {
      const { wrappedRef } = this.state;
      const wrapperNode = findDOMNode(wrappedRef.current);
      if (wrapperNode && wrapperNode.addEventListener) {
        wrapperNode.removeEventListener('focus', this.setFocus);
      }
      clearTimeout(this.focusTimer);
    }

    setFocus = () => {
      // delay setting focus to avoid interupting events,
      // 10ms was chosen empirically based on ie11 using Select and TextInput
      // with and without a FormField.
      clearTimeout(this.focusTimer);
      this.focusTimer = setTimeout(() => {
        if (!this.state.focus) {
          this.setState({ focus: true });
        }
      }, 10);
    }

    resetFocus = () => {
      clearTimeout(this.focusTimer);
      this.focusTimer = setTimeout(() => {
        if (this.state.focus) {
          this.setState({ focus: false });
        }
      }, 10);
    }

    render() {
      const { onFocus, onBlur, withFocusRef, ...rest } = this.props;
      const { focus, wrappedRef } = this.state;
      return (
        <WrappedComponent
          ref={wrappedRef}
          focus={focus}
          {...rest}
          onFocus={(event) => {
            this.setFocus();
            if (onFocus) {
              onFocus(event);
            }
          }}
          onBlur={(event) => {
            this.resetFocus();
            if (onBlur) {
              onBlur(event);
            }
          }}
        />
      );
    }
  }

  const ForwardRef = React.forwardRef((props, ref) =>
    <FocusableComponent {...props} withFocusRef={ref} />);

  ForwardRef.displayName = getDisplayName(WrappedComponent);
  ForwardRef.name = ForwardRef.displayName;

  return ForwardRef;
};

export const withTheme = (WrappedComponent) => {
  class ThemedComponent extends Component {
    static getDerivedStateFromProps(nextProps, prevState) {
      const { themeContext, theme } = nextProps;
      const { theme: stateTheme } = prevState;
      if (theme && !stateTheme) {
        return { theme: deepMerge(themeContext, theme) };
      } else if (!theme && stateTheme) {
        return { theme: undefined };
      }
      return null;
    }

    state = {}

    render() {
      const { withThemeRef, themeContext, ...rest } = this.props;
      const { theme } = this.state;
      let content = (
        <WrappedComponent
          ref={withThemeRef}
          {...rest}
          theme={theme || themeContext}
        />
      );
      if (theme) {
        content = (
          <ThemeContext.Provider value={theme}>
            {content}
          </ThemeContext.Provider>
        );
      }
      return content;
    }
  }

  const ForwardRef = React.forwardRef((props, ref) => (
    <ThemeContext.Consumer>
      {theme =>
        <ThemedComponent {...props} themeContext={theme} withThemeRef={ref} />}
    </ThemeContext.Consumer>
  ));

  ForwardRef.displayName = getDisplayName(WrappedComponent);
  ForwardRef.name = ForwardRef.displayName;

  return ForwardRef;
};

export const withForwardRef = (WrappedComponent) => {
  const ForwardRefComponent = (
    React.forwardRef((props, ref) => <WrappedComponent forwardRef={ref} {...props} />)
  );

  ForwardRefComponent.displayName = getDisplayName(WrappedComponent);
  ForwardRefComponent.name = ForwardRefComponent.displayName;

  return ForwardRefComponent;
};

export const withAnnounce = (WrappedComponent) => {
  const ForwardRef = React.forwardRef((props, ref) => (
    <AnnounceContext.Consumer>
      {announce =>
        <WrappedComponent {...props} announce={announce} ref={ref} />}
    </AnnounceContext.Consumer>
  ));

  ForwardRef.displayName = getDisplayName(WrappedComponent);
  ForwardRef.name = ForwardRef.displayName;

  return ForwardRef;
};

export const withIconTheme = (WrappedComponent) => {
  const IconThemeComponent = props => (
    <IconThemeContext.Consumer>
      {iconTheme => <WrappedComponent {...props} iconTheme={iconTheme} />}
    </IconThemeContext.Consumer>
  );

  IconThemeComponent.displayName = getDisplayName(WrappedComponent);

  return IconThemeComponent;
};

export default { withAnnounce, withFocus, withForwardRef, withIconTheme, withTheme };
