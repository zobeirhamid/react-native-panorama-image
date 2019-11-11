import React, { Component } from 'react';
import { Animated, PanResponder, Dimensions, Image } from 'react-native';
import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from 'react-native-sensors';

const deviceWidth = Dimensions.get('window').width;

export default class PanoramaImage extends Component {
  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderMove: (evt, gestureState) => {
      this.calculateNewState(gestureState.vx * 5);
    }
  });

  constructor(props) {
    super(props);
    const { imageWidth = deviceWidth * 2 } = props;
    this.positionOnScreenX = -imageWidth / 2 + deviceWidth / 2;
    this.state = {
      y: 0
    };
  }

  componentWillMount() {
    if (gyroscope !== undefined) {
      setUpdateIntervalForType(SensorTypes.gyroscope, 12);
      gyroscope.subscribe(({ y }) => {
        this.calculateNewState(y);
      });
    }
  }

  calculateNewState(y) {
    const { imageWidth = deviceWidth * 2 } = this.props;
    const newY = y + this.state.y;
    const translateX = this.translateX(newY);
    if (translateX <= 0 && translateX >= deviceWidth - imageWidth) {
      this.setState({
        y: newY
      });
    }
  }

  translateX(y) {
    const { imageWidth = deviceWidth * 2 } = this.props;
    return this.positionOnScreenX + (y / 300) * imageWidth;
  }

  render() {
    const {
      ImageComponent = Image,
      imageWidth = deviceWidth * 2,
      imageHeight = 500
    } = this.props;
    /*
    const AnimatedCustomImage = Animated.createAnimatedComponent(
      ImageComponent
    );
    */
    const { y } = this.state;
    return (
      <Animated.Image
        {...this.props}
        {...this._panResponder.panHandlers}
        style={[
          {
            height: imageHeight,
            width: imageWidth,
            transform: [{ translateX: this.translateX(y) }]
          }
        ]}
      />
    );
  }
}
