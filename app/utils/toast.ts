import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
    });
  },
  info: (message: string) => {
    Toast.show({
      type: 'info',
      text1: 'Info',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
    });
  },
}; 