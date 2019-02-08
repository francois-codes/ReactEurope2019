import React, { Component } from 'react';
import { Image, View } from 'react-native';

class AutoHeightImage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOnLayout = this.handleOnLayout.bind(this);
  }

  componentDidMount() {
    const { source: { uri } } = this.props;

    Image.getSize(uri, (w, h) => {
      this.setState({ aspectRatio: h / w });
    });
  }

  handleOnLayout({ nativeEvent: { layout: { width } } }) {
    this.setState({ viewWidth: width });
  }

  render() {
    const { aspectRatio, viewWidth } = this.state;

    return (
      <View onLayout={this.handleOnLayout}>
        {aspectRatio ? (
          <Image
            resizeMode="cover"
            {...{
              ...this.props,
              style: [
                this.props.style,
                viewWidth ? { height: viewWidth * aspectRatio } : null
              ]
            }}
          />
        ) : null}
      </View>
    );
  }
}

AutoHeightImage.propTypes = Image.propTypes;

export default AutoHeightImage;
