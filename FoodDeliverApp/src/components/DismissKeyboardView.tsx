import React, {ReactNode} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

const DismissKeyboardView: React.FC<{
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}> = ({children, ...props}) => (
  // 키보드 외의 화면을 누르면 키보드가 내려감
  // TouchableWithoutFeedback은 버튼인데 버튼 기능은 아님.
  // 스크린 리더기 혼란 막기 위해 accessible={false}로 버튼의 역할을 안 한다는 걸 알려줌
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      {...props}
      style={props.style}
      // 각 플랫폼별로 잘 먹는 속성 설정해줌
      behavior={Platform.OS === 'android' ? undefined : 'padding'}>
      {children}
    </KeyboardAvoidingView>
    {/* 그냥 라이브러리로 함 */}
    {/* <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView> */}
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
