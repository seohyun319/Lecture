import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, TouchableHighlight, View} from 'react-native';
import {useCallback} from 'react';

// params 추가 가능
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

// navigation.navigate - 이동 (이전 상태 보존)
// navigation.push - 쌓기 (화면 전환)
// navigation.goBack - 이전으로 이동
function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* 버튼 역할 하는 것들: Pressable, Button, TouchableHighlight, TouchableOpacity, 
      TouchableWithoutFeedback, TouchableNativeFeedback */}
      {/* 운영 체제마다 다르게 나타날 수 있음. Pressable, TouchableWithoutFeedback이 무난함 */}
      <TouchableHighlight
        // 터치했을 때의 하이라이트 색상 설정 가능
        // underlayColor={'orange'}
        // 앱이라 onClick 아니고 onPress임
        onPress={onClick}>
        <Text>Home Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Details Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    // NavigationContainer - 네비게이션 상태 저장
    // React Navigation에서 기본적으로 SafeAreaView로 감싸줌
    <NavigationContainer>
      {/* initialRouteName: 기본이 될 라우트 */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // 페이지 제목
          // Screen options에 함수를 넣어 route.params로 params 접근 가능
          options={{title: 'Overview'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        {/* 프롭 스프레드로 넘길 땐 이 방식도 가능 */}
        {/* <Stack.Screen name="Details">
          {props => <DetailsScreen {...props} />}
        </Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
