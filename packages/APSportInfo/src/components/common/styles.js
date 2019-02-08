import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  infoColumn: { flex: 1 },
  infoRow: {
    flexDirection: 'row',
    minHeight: 53,
    paddingVertical: 0,
    borderColor: '#e8e8e8',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  bodyText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    color: 'rgb(51, 51, 51)'
  },
  label: { paddingHorizontal: 16, flex: 1, minWidth: 50 },
  labelText: { color: 'rgb(160, 170, 180)' },
  info: { paddingRight: 16, flex: 2 },
  tableRow: { paddingHorizontal: 16 },
  centerText: { textAlign: 'center' },
  section: { marginBottom: 18 }
});

export default styles;
