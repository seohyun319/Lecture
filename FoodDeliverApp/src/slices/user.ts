import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
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
  },
  // 비동기 action 만들 때 사용
  extraReducers: builder => {},
});

export default userSlice;
