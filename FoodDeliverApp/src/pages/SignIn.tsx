import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(() => {
    // trim으로 좌우 공백 없애기
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    Alert.alert('알림', '로그인 되었습니다.');
  }, [email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = email && password;

  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일을 입력해 주세요"
          placeholderTextColor="#666"
          // 삼성 패스, 지문 인식 등.
          importantForAutofill="yes"
          // 자동 완성
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          // 키보드 엔터 버튼을 다음 버튼으로 바꾸는 세팅
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          // 엔터 버튼 누를 때 패스워드 인풋에 포커스 줌
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해 주세요 (영문,숫자,특수문자)"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          onChangeText={onChangePassword}
          value={password}
          autoComplete="password"
          textContentType="password"
          // 비밀번호 입력하는 거 마스킹
          secureTextEntry
          returnKeyType="send"
          // 입력 중이면 인풋 비우는 엑스 버튼 생김
          clearButtonMode="while-editing"
          ref={passwordRef}
          // 엔터 눌렀을 때 제출
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            // 이런 식으로 배열로 합칠 수도 있음.
            // ? [styles.loginButton, styles.loginButtonActive]
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext}
          onPress={onSubmit}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
