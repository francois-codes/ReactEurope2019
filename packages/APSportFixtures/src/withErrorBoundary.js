import React from 'react';
import { ErrorBoundary } from '@applicaster/london-rn-components';

import { ERROR_MESSAGES } from './const';

export default Component => {
  const ComponentWithErrorBoundary = props => (
    <ErrorBoundary errorMessageText={ERROR_MESSAGES.general}>
      <Component {...props} />
    </ErrorBoundary>
  );

  return ComponentWithErrorBoundary;
};
