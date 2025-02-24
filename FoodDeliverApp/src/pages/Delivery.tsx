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
