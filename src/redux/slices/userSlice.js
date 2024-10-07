import { createSlice } from '@reduxjs/toolkit';


//might need to fetch from local storage later ??
const initialState = {
  isLoggedIn: null,
  currentUser: null,
  token: null,
  needPasswordChange: null,
  loggedInAs: null,
  defaultHome: null
}

const userSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const { currentUser, token, needPasswordChange } = action.payload;
      state.isLoggedIn = true;
      state.currentUser = currentUser ?? null;
      state.token = token ?? null;
      state.needPasswordChange = needPasswordChange ?? null;
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.token = null;
      state.needPasswordChange = null;
      state.loggedInAs = null;
      state.defaultHome = null;
    },
    setCurrentUser: (state, action) => {
      const { currentUser } = action.payload;
      state.currentUser = currentUser;
    },
    setLoggedInAs: (state, action) => {
      const { loggedInAs } = action.payload;
      state.loggedInAs = loggedInAs;
    },
    setDefaultHome: (state, action) => {
      const { defaultHome } = action.payload;
      state.defaultHome = defaultHome;
    }, 
    setNeedPasswordChange: (state, action) => {
      const { needPasswordChange } = action.payload;
      state.needPasswordChange = needPasswordChange;
    }
  }

});


export const { loginSuccess, logoutSuccess, setCurrentUser, setLoggedInAs, setDefaultHome, setNeedPasswordChange } = userSlice.actions;
export const selectLoggedInState = state => state.user.isLoggedIn;

export default userSlice.reducer;