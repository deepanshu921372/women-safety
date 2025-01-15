import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props: any) => (
    BaseToast({
      ...props,
      style: { borderLeftColor: '#4CAF50' },
      contentContainerStyle: { paddingHorizontal: 15 },
      text1Style: {
        fontSize: 15,
        fontWeight: '500'
      },
      text2Style: {
        fontSize: 13
      }
    })
  ),
  error: (props: any) => (
    ErrorToast({
      ...props,
      style: { borderLeftColor: '#f44336' },
      text1Style: {
        fontSize: 15,
        fontWeight: '500'
      },
      text2Style: {
        fontSize: 13
      }
    })
  )
};
