import { describe, PropTypes } from 'react-desc';

import { getAvailableAtBadge } from '../../utils';

export default (function (DropButton) {
  var DocumentedDropButton = describe(DropButton).availableAt(getAvailableAtBadge('DropButton')).description('A control that when clicked will render its children in a drop layer.\nWhen opened, the drop will control the focus so that the contents behind it\nare not focusable.\n      ').usage('import { DropButton } from \'grommet\';\n<DropButton control={element}>{dropContents...}</DropButton>');

  DocumentedDropButton.propTypes = {
    a11yTitle: PropTypes.string.description('Custom title to be used by\n      screen readers.'),
    align: PropTypes.shape({
      top: PropTypes.oneOf(['top', 'bottom']),
      bottom: PropTypes.oneOf(['top', 'bottom']),
      right: PropTypes.oneOf(['left', 'right']),
      left: PropTypes.oneOf(['left', 'right'])
    }).description('How to align the drop with respect to the control.').defaultValue({
      top: 'top',
      left: 'left'
    }),
    control: PropTypes.element.description('React node to open/close the\n      drop content.').isRequired,
    onClose: PropTypes.func.description('Callback for when the drop is closed'),
    open: PropTypes.bool.description('Whether the drop should be open or not.')
  };

  return DocumentedDropButton;
});