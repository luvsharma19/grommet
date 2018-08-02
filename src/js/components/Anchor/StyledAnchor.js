import styled from 'styled-components';

import { colorForName, focusStyle } from '../../utils';

const disabledStyle = `
  opacity: 0.3;
  cursor: default;
  text-decoration: none;
`;

const StyledAnchor = styled.a`
  box-sizing: border-box;
  font-size: inherit;
  line-height: inherit;
  color: ${props =>
    (props.theme.dark ? props.theme.global.colors.darkBackground.text
      : props.theme.anchor.color || colorForName('brand', props.theme))};
  text-decoration: ${props => props.theme.anchor.textDecoration};
  cursor: pointer;
  outline: none;

  ${props => !props.disabled && `
    &:hover {
      text-decoration: underline;
    }
  `}

  ${props => !props.primary && props.icon && props.label && `
    color: ${props.theme.anchor.color || props.theme.global.colors.text};
  `}

  ${props => props.icon && !props.label && `
    padding: ${props.theme.global.edgeSize.small};
  `}

  ${props => props.disabled && disabledStyle}
  ${props => props.focus && focusStyle}
`;

export default StyledAnchor.extend`
  ${props => props.theme.anchor.extend}
`;
