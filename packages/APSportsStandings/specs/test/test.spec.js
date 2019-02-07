import { responsiveMargin, isCompact } from '../../src/helpers/responsive';

// Bit limited here as can't use mockImplementation
jest.mock('react-native', () => ({
  Dimensions: {
    get: () => ({ width: 320 })
  }
}));

describe('Responsive helper', () => {
  describe('responsiveMargin', () => {
    it('Returns a smaller margin for phone width', () => {
      const withGutter = true;
      const margin = responsiveMargin(withGutter);
      const expectedOutput = {
        marginLeft: 16,
        marginRight: 16
      };
      expect(margin).toEqual(expectedOutput);
    });
    it('Returns zero margin if gutter option is false', () => {
      const withGutter = false;
      const margin = responsiveMargin(withGutter);
      const expectedOutput = {
        marginLeft: 0,
        marginRight: 0
      };
      expect(margin).toEqual(expectedOutput);
    });
  });

  describe('isCompact', () => {
    it('Returns true if width is less than 321', () => {
      expect(isCompact()).toBeTruthy();
    });
  });
});
