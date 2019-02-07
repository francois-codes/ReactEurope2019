import { isCompact } from '../../helpers/responsive';

// Bit limited here as can't use mockImplementation
jest.mock('react-native', () => ({
  Dimensions: { get: () => ({ width: 320 }) }
}));

describe('Responsive helper', () => {
  describe('isCompact', () => {
    it('Returns true if width is less than 321', () => {
      expect(isCompact()).toBeTruthy();
    });
  });
});
