import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setMoney(state, action) {
      state.money = action.payload;
    },
  },
  // 비동기 action 만들 때 사용
  extraReducers: builder => {},
});

export default userSlice;
