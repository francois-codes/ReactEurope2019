import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPrimaryFilterOption } from '../../actions';
import Filter from './Filter';

const mapStateToProps = state => ({
  selectedOption: state.filter.primarySelectedOption
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setFilterOption: setPrimaryFilterOption }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
