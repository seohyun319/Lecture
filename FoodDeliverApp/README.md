# 소개

현재 README는 강의안에 덧붙이거나 강의를 직접 정리한 정리본이다.

참고) [강의안](./syllabus.md), [소스 코드](https://github.com/ZeroCho/food-delivery-app/tree/master)

# 첫 시작(setting)

[공식문서](https://reactnative.dev/)

- 초기 세팅[(React Native CLI Quickstart)](https://reactnative.dev/docs/environment-setup)
- 환경 변수 설정([macOS JAVA_HOME 세팅법](https://stackoverflow.com/a/59151321))
- Android 13(티라미수). 가상기기는 Nexus 5
- [adb](https://developer.android.com/studio/releases/platform-tools) 설치 필요, ANDROID_HOME 환경변수도

시작 명령어

```shell
npm start // npx react-native start
npm run android // npx react-native run-android
npm run ios // npx react-native run-ios
```

## 폴더 구조

- android: 안드로이드 네이티브 폴더
- ios: ios 네이티브 폴더
- node_modules: 노드 라이브러리
- app.json: name은 앱 컴포넌트 이름이니 함부로 바꾸면 안 됨, 이거 바꾸면 네이티브 컴포넌트 이름도 다 바꿔야함, displayName은 앱 이름 변경용
  - ios/FoodDeliveryApp/AppDelegate.mm 의 moduleName
  - android/app/src/main/java/com/fooddeliveryapp/MainActivity.java 의 getMainComponentName
- babel.config.js: 바벨 설정
- index.js: 메인 파일
- App.tsx: 기본 App 컴포넌트
- metro.config.js: 메트로 설정 파일(웹팩 대신 사용)
- tsconfig.json: 타입스크립트 설정
- android/app/src/main/java/com/fooddeliveryapp/MainActivity.java: 안드로이드 액티비티에서 js엔진 통해 리액트 코드 실행 + bridge로 소통

## 앱 실행 후

- cmd + R로 리로딩
- cmd + D로 디버그 메뉴
- Debugging with Chrome으로 개발자 도구 사용 가능
- Configure Bundler로 메트로 서버 포트 변경 가능
- Show Perf Monitor로 프레임 측정 가능

## 앱 이름 변경

\android\app\src\main\res\values\strings.xml

app.json의 displayName

\ios\FoodDeliveryApp\Info.plist의 CFBundleDisplayName

**단!** 0.68버전부터는 app.json, strings.xml, CFBundleDisplayName을 한글로하면 튕기는 문제 발생. 그럴때는 전부 영어로 되돌리고
ios에서는 [링크](https://thddudco.tistory.com/16) 따라서 다국어 설정으로 한국어 설정할 것.
또한 안드로이드에서는 \android\app\src\main\res\values\strings.xml은 영어로 두고 \android\app\src\main\res\values-ko\strings.xml 을 새로 만들어 여기서 한글로 변경할 것

# 코딩 시작!

## App.tsx 분석

- View가 div, Text가 span이라고 생각하기(1대1 매칭은 아님)
- css는 dp 단위(density-independent pixels, 다양한 화면 크기에 영향받지 않음)
- [css 속성 리스트](https://github.com/vhpoet/react-native-styling-cheat-sheet): 좀 오래됨
- flex에서는 flexDirection이 Column이 default

## React Navigation

react-router-native도 대안임(웹에서 넘어온 개발자들에게 친숙, 웹처럼 주소 기반)

```shell
npm i @react-navigation/native
npm i @react-navigation/native-stack
npm i react-native-screens@3.22.1 react-native-safe-area-context
npx pod-install # 맥 전용
```

android/app/src/main/java/FoodDeliveryApp/MainActivity.kt

```kt
import android.os.Bundle;

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
```

App.tsx 교체

```typescript jsx
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
```

- safe-area가 적용되어 있음
- NavigationContainer: 내비게이션 상태 저장
- Navigator 안에 Screen들 배치
- Screen name 대소문자 상관 없음, component는 보통 두 가지 방식 사용(컴포넌트 그 자체 vs Render Callback)
- props로 navigation과 route가 전달됨
- Pressable, Button, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback
- navigation.navigate로 이동 가능
- navigation.push로 쌓기 가능
- navigation.goBack으로 이전으로 이동
- params 추가 가능(params에 user같은 객체를 통째로 넣지 말기, id를 넣고 user는 글로벌 스토어에 넣기)
- Screen options.title: 제목
- Screen options에 함수를 넣어 route.params로 params 접근 가능
- navigation.setOptions로 옵션 변경 가능
- Navigator screenOptions로 공통 옵션 설정
- Screen options.headerShown로 헤더표시여부
- Screen options.headerTitle로 커스텀 컴포넌트
- Screen options.headerRight로 우측 버튼(useLayoutEffect)
  [옵션 목록](https://reactnavigation.org/docs/screen-options)

## 라우터 만들기 (ch2)

```shell
npm install @react-navigation/bottom-tabs
```

App.tsx

```typescript jsx
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import {useState} from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  // 파라미터 받음
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          {/* Tab.Group은 Screen 묶어줄 수 있음. react fragment 역할 */}
          {/* 특정 스크린간 공통 속성 있을 때도 묶어주면 됨 */}
          {/* <Tab.Group></Tab.Group> */}
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
```

- Tab.Navigator 도입
- Navigator는 nesting 가능
- Drawer과 Tab.Group 사용처

  ```typescript jsx
  import React from 'react';
  import {createNativeStackNavigator} from '@react-navigation/native-stack';
  import Complete from './Complete';
  import Ing from './Ing';

  const Stack = createNativeStackNavigator();

  function Delivery() {
    return (
      <Stack.Navigator initialRouteName="Ing">
        {/* 지도 */}
        <Stack.Screen name="Ing" component={Ing} options={{title: '내 오더'}} />
        {/* 완료 처리 화면이 지도 위에 쌓이게 스택으로 구성함. */}
        <Stack.Screen
          name="Complete"
          component={Complete}
          options={{title: '완료하기'}}
        />
      </Stack.Navigator>
    );
  }

  export default Delivery;
  ```

## 회원가입, 로그인 화면 만들기

src/components/DismissKeyBoardView.tsx

```typescript jsx
import React, {ReactNode} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
// 강의에 나오는 scrollview 라이브러리는 타입스크립트 지원 안 됨😂
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DismissKeyboardView: React.FC<{
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}> = ({children, ...props}) => (
  // 키보드 외의 화면을 누르면 키보드가 내려감
  // TouchableWithoutFeedback은 버튼인데 버튼 기능은 아님.
  // 스크린 리더기 혼란 막기 위해 accessible={false}로 버튼의 역할을 안 한다는 걸 알려줌
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {/* <KeyboardAvoidingView
      {...props}
      style={props.style}
      // 각 플랫폼별로 잘 먹는 속성 설정해줌
      behavior={Platform.OS === 'android' ? undefined : 'padding'}>
      {children}
    </KeyboardAvoidingView> */}
    {/* 그냥 라이브러리로 함 */}
    <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
```

인풋 바깥 클릭 시 키보드를 가리기 위함

- src/pages/SignIn.tsx
- src/pages/SignUp.tsx
- src/components/DismissKeyboardView.tsx
- TextInput, StyleSheet.compose 사용
- DismissKeyboardView 만들기(Keyboard, KeyboardAvoidingView)
- KeyboardAvoidingView는 불편해 react-native-keyboard-aware-scroll-view를 대안으로 사용

```shell
npm i react-native-keyboard-aware-scroll-view
```

## 서버 요청 보내기(ch3)

back 서버 실행 필요, DB 없이도 되게끔 만들어둠. 서버 재시작 시 데이터는 날아가니 주의

```shell
# 터미널 하나 더 켜서
cd back
npm i
npm start
```

리덕스 설정

```shell
npm i @reduxjs/toolkit react-redux
```

src/store/index.ts와 src/store/reducer.ts, src/slices/user.ts 작성

AppInner.tsx 생성 및 isLoggedIn을 redux로 교체(AppInner 분리 이유는 App.tsx에서 useSelector를 못 씀)

App.tsx

```typescript jsx
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
```

- action: state를 바꾸는 행위/동작
- dispatch: 그 액션을 실제로 실행하는 함수
- reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

## 회원가입, 로그인

액세스토큰/리프레시토큰을 받아서 다음 라이브러리로 저장

```shell
npm install react-native-encrypted-storage
npx pod-install # ios 전용
```

서버 요청은 axios 사용

```shell
npm i axios
```

환경변수, 키 값을 저장할 config 패키지

```shell
npm i react-native-config
```

```typescript jsx
import Config from 'react-native-config';
```

- .env에 키=값 저장해서(예를 들어 abc=def) Config.abc로 꺼내 씀
  .env

```
API_URL=http://10.0.2.2:3105
```

암호화해서 저장할 데이터는 다음 패키지에

```
import EncryptedStorage from 'react-native-encrypted-storage';
```

```typescript jsx
await EncryptedStorage.setItem('키', '값');
await EncryptedStorage.removeItem('키');
const 값 = await EncryptedStorage.getItem('키');
```

- redux에 넣은 데이터는 앱을 끄면 날아감
- 앱을 꺼도 저장되어야 하고 민감한 값은 encrypted-storage에
- 개발 환경별로 달라지는 값은 react-native-config에 저장하면 좋음(암호화 안 됨)
- 그 외에 유지만 되는 데이터들은 async-storage에 저장(npm install @react-native-async-storage/async-storage)

src/pages/SignUp.tsx, src/pages/SignIn.tsx

로딩 중일 땐 ActivityIndicator를 보여줄 수 있음.

## 소켓IO 연결

웹소켓 기반 라이브러리

- 요청-응답 방식이 아니라 실시간 양방향 통신 가능

```shell
npm i socket.io-client
```

src/hooks/useSocket.ts

```typescript jsx
import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(`${Config.API_URL}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
```

AppInner.tsx

```typescript jsx
const [socket, disconnect] = useSocket();

useEffect(() => {
  const helloCallback = (data: any) => {
    console.log(data);
  };
  if (socket && isLoggedIn) {
    console.log(socket);
    socket.emit('login', 'hello');
    socket.on('hello', helloCallback);
  }
  return () => {
    if (socket) {
      socket.off('hello', helloCallback);
    }
  };
}, [isLoggedIn, socket]);

useEffect(() => {
  // 로그아웃하면 연결 끊어주기
  if (!isLoggedIn) {
    console.log('!isLoggedIn', !isLoggedIn);
    disconnect();
  }
}, [isLoggedIn, disconnect]);
```

- login을 emit하면 그때부터 서버가 hello로 데이터를 보내줌 \*로그아웃 시에 disconnect해주는 것 잊지 말기

## 로그아웃

src/pages/Settings.tsx

```tsx
const accessToken = useSelector((state: RootState) => state.user.accessToken);
const dispatch = useAppDispatch();
const onLogout = useCallback(async () => {
  try {
    await axios.post(
      `${Config.API_URL}/logout`,
      {},
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );
    Alert.alert('알림', '로그아웃 되었습니다.');
    dispatch(
      userSlice.actions.setUser({
        name: '',
        email: '',
        accessToken: '',
      }),
    );
    await EncryptedStorage.removeItem('refreshToken');
  } catch (error) {
    const errorResponse = (error as AxiosError).response;
    console.error(errorResponse);
  }
}, [accessToken, dispatch]);
```

## 실제 주문 받기[ch4]

socket.io에서 주문 내역 받아서 store에 넣기

AppInner.tsx

```typescript
useEffect(() => {
  const callback = (data: any) => {
    console.log(data);
    dispatch(orderSlice.actions.addOrder(data));
  };
  if (socket && isLoggedIn) {
    // 주문 받겠다고 선언
    socket.emit('acceptOrder', 'order');
    // 서버에서 주문 전달
    socket.on('order', callback);
  }
  return () => {
    if (socket) {
      socket.off('order', callback);
    }
  };
}, [isLoggedIn, socket]);
```

## 주문 데이터 리덕스에 저장하기

[src/slices/order.ts](./src/slices/order.ts)

## 앱 다시 켤 때 자동로그인되게

encrypted-storage에서 토큰 불러오기

AppInner.tsx

```typescript
// 앱 실행 시 토큰 있으면 로그인하는 코드
useEffect(() => {
  const getTokenAndRefresh = async () => {
    try {
      const token = await EncryptedStorage.getItem('refreshToken');
      if (!token) {
        return;
      }
      const response = await axios.post(
        `${Config.API_URL}/refreshToken`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
    } catch (error) {
      console.error(error);
      if (
        (error as AxiosError<{code: string}>).response?.data.code === 'expired'
      ) {
        Alert.alert('알림', '다시 로그인 해주세요.');
      }
    }
  };
  getTokenAndRefresh();
}, [dispatch]);
```

- 잠깐 로그인 화면이 보이는 것은 SplashScreen으로 숨김

## 수익금 확인하기

src/pages/Settings.tsx

```tsx
const money = useSelector((state: RootState) => state.user.money);
const name = useSelector((state: RootState) => state.user.name);

useEffect(() => {
  async function getMoney() {
    const response = await axios.get<{data: number}>(
      `${Config.API_URL}/showmethemoney`,
      {
        headers: {authorization: `Bearer ${accessToken}`},
      },
    );
    dispatch(userSlice.actions.setMoney(response.data.data));
  }
  getMoney();
}, [accessToken, dispatch]);

...

<Text style={styles.moneyText}>
  {name}님의 수익금{' '}
  <Text style={{fontWeight: 'bold'}}>
    {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  </Text>
  원
</Text>;
```

## 주문 화면 만들기(수락/거절)

src/pages/Orders.tsx

```typescript jsx
import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {Order} from '../slices/order';
import EachOrder from '../components/EachOrder';

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);
  const renderItem = useCallback(({item}: {item: Order}) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Orders;
```

- 서버에서 내려주는 데이터일 때 내부 콘텐츠 양이 얼마나 될지 모르기 때문에 ScrollView + map 조합은 좋지 않음. FlatList 권장.
- FlatList
  - data에 넣은 걸 반복해줌.
  - keyExtractor 설정 필수
  - renderItem: 렌더해줄 아이템.
- 반복되는 것은 컴포넌트로 빼는 것이 좋음. 같은 파일 내에 넣는 것보다 다른 파일로 빼는 편이 좋음.

src/components/EachOrder.tsx

```typescript jsx
const renderItem = useCallback(({item}: {item: Order}) => {
  return (
    <View key={item.orderId} style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
      </Pressable>
    </View>
  );
}, []);
```

## accessToken 만료시 자동으로 refresh되게

axios.interceptor 설정하기

```typescript
useEffect(() => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const {
        config,
        response: {status},
      } = error;
      if (status === 419) {
        if (error.response.data.code === 'expired') {
          const originalRequest = config;
          const refreshToken = await EncryptedStorage.getItem('refreshToken');
          // token refresh 요청
          const {data} = await axios.post(
            `${Config.API_URL}/refreshToken`, // token refresh api
            {},
            {headers: {authorization: `Bearer ${refreshToken}`}},
          );
          // 새로운 토큰 저장
          dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
          originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
          // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    },
  );
}, [dispatch]);
```

## 네이버 지도 사용하기[ch4]

```shell
npm i @mj-studio/react-native-naver-map@1
```

- [링크](https://github.com/mym0404/react-native-naver-map?tab=readme-ov-file#install) 따라서 추가 설치(네이버맵 플랫폼 키도 발급받아야 함)
- New Architecture의 경우 설치 시 뒤에 @1 대신 @2를 적어서 설치하면 됨

android/build.gradle

```
allprojects {
    repositories {
        maven {
            url "https://repository.map.naver.com/archive/maven"
        }
    }
}
```

- 안드로이드 앱 패키지 이름: com.[원하는이름].fooddeliveryapp (ex: com.zerocho.fooddeliveryapp)
- [커밋 참조](https://github.com/ZeroCho/food-delivery-app/commit/36295cabf2cdab4ed68fa3b907c7b467101a02a5) (폴더 등 변경할 게 많음)
- [ios]Xcode로는 xcworkspace 파일을 열어야함(xcodeproj 열면 안됨, xcworkspace가 없다면 ios 폴더에서 pod install 한 번 입력해볼 것)
- [ios]iOS Bundle ID: com.[원하는이름].fooddeliveryapp(ex: com.zerocho.fooddeliveryapp)로 수정

src/components/EachOrder.tsx

```typescript jsx
import {NaverMapView, NaverMapMarkerOverlay, NaverMapPathOverlay} from '@mj-studio/react-native-naver-map';
...
<View
  style={{
    width: Dimensions.get('window').width - 30,
    height: 200,
    marginTop: 10,
  }}
>
  <NaverMapView
    style={{width: '100%', height: '100%'}}
    isShowZoomControls={false}
    initialCamera={{
      latitude: (start.latitude + end.latitude) / 2,
      longitude: (start.longitude + end.longitude) / 2,
      zoom: 10,
      tilt: 50,
    }}
    isShowLocationButton
    isShowCompass={false}
    isShowScaleBar
  >
    <NaverMapMarkerOverlay
      latitude={start.latitude}
      longitude={start.longitude}
      tintColor="blue"
    />
    <NaverMapPathOverlay
      coords={[
        {
          latitude: start.latitude,
          longitude: start.longitude,
        },
        {latitude: end.latitude, longitude: end.longitude},
      ]}
    />
    <NaverMapMarkerOverlay
      latitude={end.latitude}
      longitude={end.longitude}
    />
  </NaverMapView>
</View>
```

## 위치 정보 가져오기

권한 얻기(위치정보, 카메라, 갤러리)

```shell
npm i react-native-permissions
```

ios/Podfile

```
pod 'NMapsMap', '3.16.0'
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
pod 'Permission-LocationAccuracy', :path => "#{permissions_path}/LocationAccuracy"
pod 'Permission-LocationAlways', :path => "#{permissions_path}/LocationAlways"
pod 'Permission-LocationWhenInUse', :path => "#{permissions_path}/LocationWhenInUse"
pod 'Permission-Notifications', :path => "#{permissions_path}/Notifications"
pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
```

ios/FoodDeliveryApp/Info.plist

```
<!-- 권한 허용 받을 때 유저에게 하는 설명 -->
<key>NSCameraUsageDescription</key>
<string>배송완료 사진 촬영을 위해 카메라 권한이 필요합니다.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSMotionUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>배송완료 사진 선택을 위해 라이브러리 접근 권한이 필요합니다.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>배송완료 사진 선택을 위해 라이브러리 접근 권한이 필요합니다.</string>
```

android/app/src/main/AndroidManifest.xml

```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

```shell
npx pod-install
```

- [플로우](https://github.com/zoontek/react-native-permissions)를 잘 볼 것

src/hooks/usePermissions.ts

```typescript jsx
import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

function usePermissions() {
  // 권한 관련
  useEffect(() => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result);
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    }
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    } else {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    }
  }, []);
}

export default usePermissions;
```

- [ios]혹시나 앱 설정 화면에 위치 권한이 없을 경우 Delivey 페이지까지 한 번 들어갔다 나오기. 그럼 생겨있음.
- Platform으로 운영체제 구별
- Linking으로 다른 서비스 열기 가능
  위치 정보 가져오기

```shell
npm i @react-native-community/geolocation
```

src/pages/Ing.tsx

```tsx
import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {
  NaverMapView,
  NaverMapPathOverlay,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';

type IngScreenProps = NativeStackScreenProps<LoggedInParamList, 'Delivery'>;

function Ing({navigation}: IngScreenProps) {
  console.dir(navigation);
  const deliveries = useSelector((state: RootState) => state.order.deliveries);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

  if (!deliveries?.[0]) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>주문을 먼저 수락해주세요!</Text>
      </View>
    );
  }

  if (!myPosition || !myPosition.latitude) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </View>
    );
  }

  const {start, end} = deliveries?.[0];

  return (
    <View>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <NaverMapView
          style={{height: Dimensions.get('window').height - 120}}
          initialCamera={{
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
            zoom: 10,
            tilt: 50,
          }}
          isShowZoomControls
          isShowLocationButton
          isShowCompass={false}
          isShowScaleBar>
          {myPosition?.latitude && (
            <NaverMapMarkerOverlay
              latitude={myPosition.latitude}
              longitude={myPosition.longitude}
              width={100}
              height={100}
              anchor={{x: 0.5, y: 0.5}}
              caption={{text: '나'}}
              image={require('../assets/red-dot.png')}
            />
          )}
          {myPosition?.latitude && (
            <NaverMapPathOverlay
              coords={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                {latitude: start.latitude, longitude: start.longitude},
              ]}
              color="orange"
            />
          )}
          <NaverMapMarkerOverlay
            latitude={start.latitude}
            longitude={start.longitude}
            width={15}
            height={15}
            globalZIndex={1000}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '출발'}}
            image={require('../assets/blue-dot.png')}
          />
          <NaverMapPathOverlay
            coords={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
            globalZIndex={1000}
            color="orange"
          />
          <NaverMapMarkerOverlay
            latitude={end.latitude}
            longitude={end.longitude}
            width={15}
            globalZIndex={1000}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '도착'}}
            image={require('../assets/green-dot.png')}
            onTap={() => {
              console.log(navigation);
              navigation.push('Complete', {orderId: deliveries[0].orderId});
            }}
          />
        </NaverMapView>
      </View>
    </View>
  );
}

export default Ing;
```

## 이미지 선택하기(주문 완료)

src/pages/Complete.tsx

```tsx
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import orderSlice from '../slices/order';
import {useAppDispatch} from '../store';

function Complete() {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<LoggedInParamList>>();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      // 미리보기 표시해줌
      includeBase64: true,
      // 카메라 찍은 방향 정보
      includeExif: true,
      saveToPhotos: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const orderId = route.params?.orderId;
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);
    try {
      await axios.post(`${Config.API_URL}/complete`, formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      Alert.alert('알림', '완료처리 되었습니다.');
      navigation.goBack();
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Pressable
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Complete;
```

이미지 선택 후 리사이징

```shell
npm i react-native-image-crop-picker
npm i react-native-image-resizer
npx pod-install # ios 전용
```

- 이미지 업로드에는 multipart/form-data를 사용함
- 이미지는 { uri: 주소, name: 파일명, type: 확장자 } 꼴
- base64로 이미지를 텍스트꼴로 표현 가능(용량 33% 증가)
- resizeMode: cover(꽉 차게), contain(딱 맞게), stretch(비율 무시하고 딱 맞게), repeat(반복되게), center(중앙 정렬)

## 사진 찍을 때 이미지를 카메라롤/갤러리에 저장하고 싶음[ch5]

Native Module Patching

```shell
npm i patch-package
```

(pnpm의 경우 pnpm patch라는 별도의 커맨드로 통합되어 있어 patch-package를 설치할 필요가 없음)

package.json

```json
  "scripts": {
    "postinstall": "patch-package",
    "android": "react-native run-android",
```

- patch 후 적용하기

```shell
npx patch-package react-native-image-crop-picker
```

- 앞으로 npm i 할 때마다 자동으로 패치가 적용됨(postinstall 스크립트 덕분)
- 이런 것 때문에 네이티브를 알아야함 ㅠ

## Tmap 연결하기(Native Modules)

[가입](https://openapi.sk.com/)

- My Project - 프로젝트 생성 - TMap API 신청(무료)
- [sdk](https://openapi.sk.com/resource/sdk/indexView)
- [안드로이드 연동](http://tmapapi.sktelecom.com/main.html#android/guide/androidGuide.sample1)
- [ios][iOS 연동](http://tmapapi.sktelecom.com/main.html#ios/guide/iosGuide.sample1)
- [ios]iOS 연동시 Header 파일들이 project.pbxproj에 등록되었나 확인(다른 것도 당연히)
- android/app/src/java/com/zerocho/fooddeliveryapp/TMapModule.java 생성
- android/app/src/java/com/zerocho/fooddeliveryapp/TMapPackage.java 생성
- android/app/src/java/com/zerocho/fooddeliveryapp/MainApplication에 TMapPackage 연결
- [ios]ios/FoodDeliveryApp/RCTTMap.h
- [ios]ios/FoodDeliveryApp/RCTTMap.m
- [ios]ios/FoodDeliveryApp-Bridging-Header.h
- src/modules/TMap.ts

android/app/src/main/AndroidManifest.xml

```
...
  <queries>
    <package android:name="com.skt.tmap.ku" />
  </queries>
</manifest>
```

src/pages/Ing.tsx

```typescript jsx
TMap.openNavi(
  '도착지',
  end.longitude.toString(),
  end.latitude.toString(),
  'MOTORCYCLE',
).then(data => {
  console.log('TMap callback', data);
  if (!data) {
    Alert.alert('알림', '티맵을 설치하세요.');
  }
});
```

## react-native-splash-screen

```shell
npm i react-native-splash-screen
```

- [여기서](https://github.com/crazycodeboy/react-native-splash-screen) Third step과 Getting Started 따라하기
- android/app/src/main/res/drawable 폴더 만들고 그 안에 launch_screen.png 넣기
  AppInner.tsx

```
...
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          SplashScreen.hide();
          return;
        }
        ...
      } finally {
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
```

## 앱 icon 변경

- [Android](<http://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(255%2C%20255%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher>) 다운받은 후 android/app/src/main 아래에 넣기
- [ios] [링크](https://appicon.co/) 에서 다운로드된 Assets.xcassets를 ios/FoodDeliveryApp 내부에 넣기
- [ios]Xcode에서 아이콘 연결 필요

## 앱 하단 메뉴 아이콘

```shell
npm i react-native-vector-icons
npm i -D @types/react-native-vector-icons
```

[목록](https://oblador.github.io/react-native-vector-icons/)

- android/app/src/main/assets/fonts에 node_modules/react-native-vector-icons/Fonts 폴더 복사
- [ios]Xcode에서 New Group으로 메뉴를 생성하고 Fonts 그룹에 node_modules/react-native-vector-icons/Fonts 폰트들을 추가

## 주문완료 사진들 보여주기

```shell
npm i react-native-fast-image
```

[링크](https://github.com/DylanVann/react-native-fast-image)
src/slices/order.ts

```typescript
interface InitialState {
  ...
  completes: Order[];
}
const initialState: InitialState = {
  ...
  completes: [],
};
...
    setCompletes(state, action) {
      state.completes = action.payload;
    },
```

src/pages/Settings.tsx

```typescript jsx
const renderItem = useCallback(({item}: {item: Order}) => {
  return (
    <FastImage
      source={{uri: `${Config.API_URL}/${item.image}`}}
      resizeMode="contain"
      style={{
        height: Dimensions.get('window').width / 3,
        width: Dimensions.get('window').width / 3,
      }}
    />
  );
}, []);

<FlatList
  data={completes}
  numColumns={3}
  keyExtractor={o => o.orderId}
  renderItem={renderItem}
/>;
```

## FCM[ch6]

푸쉬알림 보내기

- [링크](https://console.firebase.google.com/)에서 앱 만들기

```shell
npm i @react-native-firebase/analytics @react-native-firebase/app @react-native-firebase/messaging
npm i react-native-push-notification @react-native-community/push-notification-ios
npm i -D @types/react-native-push-notification
npx pod-install
```

[ios] pod install 시 에러 발생 시 다음 pod 코드 두 줄 추가
ios/Podfile

```
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  pod 'FirebaseCore', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true

  target 'FoodDeliveryAppTests' do
```

[ios] [따라할 것](https://github.com/react-native-push-notification/ios)

- firebase 프로젝트 설정 - Admin SDK - Node.js - 새 비공개키 생성 - back 폴더 안에 넣고 app.js 소스 수정
- 안드로이드 앱 설정 후 google-services.json을 android/app에 넣기
- [ios] 아이폰 앱 설정 후 ios/GoogleService-Info.plist 생성
- 배송 완료시 push 알림이 올 것임(에뮬레이터에서는 안 올 수 있음)

[리액트 내비게이션과 연동](https://reactnavigation.org/docs/navigation-container/#linkinggetinitialurl)

App.tsx

```

```

## 실기기 사용하기

[링크](https://reactnative.dev/docs/running-on-device)

- samsung dex같은 건 끄기
- 핸드폰 usb 연결 시 usb 디버깅 허용하기
- .env에서 ip주소 바꾸기

```shell
adb devices
adb -s <기기이름> reverse tcp:8081 tcp:8081
```

여러 문제 발견 가능

- 폰트가 흰색: style에 color 주기
- vector-icons 안 뜸: 역시 style에 color 주기(ch6 AppInner.tsx 참고)

## 배포 관련

### Android

android/app/build.gradle

```
def enableSeparateBuildPerCPUArchitecture = true

/**
* Run Proguard to shrink the Java bytecode in release builds.
*/
def enableProguardInReleaseBuilds = true
```

package.json

```json
  "scripts": {
    ...
    "build:android": "npm ci && cd android && ./gradlew bundleRelease && cd .. && open android/app/build/outputs/bundle/release",
    "apk:android": "npm ci && cd android && ./gradlew assembleRelease && cd .. && open android/app/build/outputs/apk/release",
```

[출시 과정](https://reactnative.dev/docs/signed-apk-android)

### iOS

iOS 개발자 멤버쉽 가입 필요

[출시 과정](https://reactnative.dev/docs/publishing-to-app-store)

- Xcode로 Archive(이 때 simulator를 선택한 상태이면 안 됨)

### [ios]fastlane

버저닝, 배포 자동화 가능

### CodePush

- 실시간으로 앱 수정 가능(JS코드, 이미지, 비디오만)
- 노드모듈, 네이티브쪽 수정은 앱 배포 필요

[앱센터 가입](https://appcenter.ms/)

- [여기서](https://appcenter.ms/apps/create) 앱 만들기(iOS, Android 따로)

```shell
npm i react-native-code-push
npm install appcenter appcenter-analytics appcenter-crashes
npm i -g appcenter-cli (맥에서는 sudo 필요)
appcenter login
appcenter codepush deployment list -a zerohch0/food-delivery-app-android -k
```

- android/app/src/main/assets/appcenter-config.json
- android/app/src/main/res/values/strings.xml 수정
- [추가 작업](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md)
- [ios] ios/AppCenter-Config.plist
- [ios] [추가 작업](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md)

App.tsx

```typescript jsx
import codePush from 'react-native-code-push';

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  // 언제 업데이트를 체크하고 반영할지를 정한다.
  // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
  // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
};
function App() {}

export default codePush(codePushOptions)(App);
```

```package.json
"codepush:android": "appcenter codepush release-react -a 아이디/앱이름 -d 배포이름 --sourcemap-output --output-dir ./build -m -t 타겟버전",
"codepush:ios": "appcenter codepush release-react -a 아이디/앱이름 -d 배포이름 --sourcemap-output --output-dir ./build -m -t 타겟버전",
"bundle:android": "react-native bundle --assets-dest build/CodePush --bundle-output build/CodePush/index.android.bundle --dev false --entry-file index.js --platform android --sourcemap-output build/CodePush/index.android.bundle.map",
"bundle:ios": "react-native bundle --assets-dest build/CodePush --bundle-output build/CodePush/main.jsbundle --dev false --entry-file index.js --platform ios --sourcemap-output build/CodePush/main.jsbundle.map",
```

- 실제 예시는 package.json 참조

## iOS Pod 관련

[맥 전용]ios 폴더 안에서 pod 명령어 수행 가능, but npx pod-install은 프로젝트 폴더 어디서나 가능

- Podfile: 설치할 Pod과 개별설정들 기록
- pod deintegrate: 기존 pod들 제거
- pod update: 기존 pod 버전 업그레이드(pod install 시)
- pod install: npx pod-install 역할 Podfile.lock에 따라 설치
- pod install --repo-update: pod들 설치하면서 최신으로 유지

## Hermes 켜기

시작 성능 빨라지고, 메모리 사용량 적고, 앱 사이즈 작아짐

[헤르메스 켜기](https://reactnative.dev/docs/hermes)

# 꿀팁들

- [patch-package](https://www.npmjs.com/package/patch-package): 노드모듈즈 직접 수정 가능, 유지보수 안 되는 패키지 업데이트 시 유용, 다만 patch-package한 패키지는 추후 버전 안 올리는 게 좋음
- [Sentry](https://sentry.io/): 배포 시 React Native용으로 붙여서 에러 모니터링하면 좋음(무료 지원)
- [react-native-upgrade helper](https://react-native-community.github.io/upgrade-helper/): 버전 업그레이드 방법 나옴

## 에러들

### Error: listen EADDRINUSE: address already in use :::8081

이미 메트로 서버가 다른 데서 켜져 있는 것임. 메트로 서버를 실행하고 있는 터미널 종료하기

### npm run android 시 Running jetifier to migrate libraries to AndroidX.쪽에서 안 넘어가는 경우

메트로 서버 꺼볼 것

### 완료처리 시 "유효하지 않은 주문입니다."

axios@0.24 설치(axios@0.25.0에 문제 있음)
[링크](https://github.com/axios/axios/issues/4406)

### java.lang.RuntimeException: Unable to load script. Make sure you're either running Metro (run 'npx react-native start') or that your bundle 'index.android.bundle' is packaged correctly for release.

- android/app/src/main/assets 폴더 만들기

```shell
cd android
./gradlew clean
cd ..
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

### Execution failed for task ':app:packageDebug'. > java.lang.OutOfMemoryError (no error message)

android/gradle.properties에 다음 줄 주석 해제

```
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

또는

android/app/src/main/AndroidManifest.xml 에서 <application> 태그에 android:largeHeap="true" 추가

### Installed Build Tools revision 33.0.0 is corrupted. Remove and install again using the SDK Manager.

안드로이드 스튜디오의 SDK Tools에서 33.0.0 제거한 후 다시 설치. show package details 눌러보면 33.0.0 보임

### Failed to transform react-native-0.71.0-rc.0-debug.aar

0.71 미만 버전들에서 발생
[여기](https://github.com/facebook/react-native/issues/35210)에 나오는 최신버전으로 업데이트
[업그레이드 헬퍼](https://react-native-community.github.io/upgrade-helper/)사용하면 편리

### warn No apps connected. Sending "reload" to all React Native apps failed. Make sure your app is running in the simulator or on a phone connected via USB.

```
npx react-native start --reset-cache
cd android && ./gradlew clean
cd ..
npx react-native run-android
```

### ERR_OSSL_DSO_COULD_NOT_LOAD_THE_SHARED_LIBRARY

윈도에서 발생하는 에러인데 choco로 openssl 다시 설치하기

```
choco install openssl
```

### Error: spawn ./gradlew EACCES

```shell
chmod 755 android/gradlew
```

### error: bundling failed: TypeError: Cannot read property 'transformFile' of undefined

node.js 16버전으로 할 것, node 17버전부터 해당 에러 발생함.

### ERROR Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication)

보통 App.tsx 부분이 여러번 실행되어서 발생함. Metro 서버를 껐다가 켜고, 에뮬레이터에서 앱을 지웠다가 다시 설치하면 해결 됨

### Manifest merger failed : android:exported needs to be explicitly specified for element <receiver#com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver>. Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined

[링크](https://www.inflearn.com/questions/630107/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-%ED%91%B8%EC%8B%9C-%EB%85%B8%ED%8B%B0-%EC%84%A4%EC%A0%95-%EC%8B%9C-quot-android-exported-needs-to-be-explicitly-specified-quot)

### Invariant Violation: "FoodDeliveryApp" has not been registered. This can happen if

서버 실행 시 JS단에서 에러가 발생해서 발생함. JS단 에러부터 해결할 것. 애러가 없다면 index.js의 appName이 일치하는지 확인할 것

### Error: No Firebase App '[DEFAULT]' has been created - call firebase.initializeApp()

파이어베이스 앱 만들어둘 것

### error Cannot start server in new window because no terminal app was specified.

rn73부터는 앱 실행을 위해 npm start 실행 후 i나 a를 눌러 아이폰/안드로이드 실행하면 됩니다.

### Duplicate class android.support.v4.app.INotificationSideChannel found in modules classes?

android/gradle.properties에 다음 코드 추가

```
android.enableJetifier=true
```

## 스스로 해보면 좋을 것

- loading, disabled 처리 모두 다 하기
- 내 위치 앱 시작하고 권한 있을 때 미리 받아놓기
- refreshtoken이 만료되면 어떻게?(현재는 무한 419뜸)
