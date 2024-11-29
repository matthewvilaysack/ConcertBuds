import { Dimensions } from 'react-native';

// Extract device dimensions
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// Helper function to calculate height percentage
const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

// Helper function to calculate width percentage
const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

export { hp, wp };
