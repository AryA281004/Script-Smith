import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        isLoggedOut: false,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isLoggedOut = false;
        },
        updateCredits: (state, action) => {
            if (state.userData) {
                state.userData.credits = action.payload;
            }
        },
        addBadge: (state, action) => {
            // action.payload should be a string badge name
            if (!state.userData) return;
            if (!state.userData.badges) state.userData.badges = [];
            const b = action.payload;
            if (!state.userData.badges.includes(b)) {
                state.userData.badges.push(b);
            }
        },
        setBadges: (state, action) => {
            // action.payload should be an array of badge strings
            if (!state.userData) return;
            state.userData.badges = Array.isArray(action.payload) ? action.payload : [];
        },
        mergeUserData: (state, action) => {
            // merge partial user data into existing userData
            if (!state.userData) {
                state.userData = action.payload || null;
                return;
            }
            state.userData = { ...state.userData, ...(action.payload || {}) };
        },
        logoutUser: (state) => {
            state.userData = null;
            state.isLoggedOut = true;
        },
        

    },
});

export const { setUserData, updateCredits, addBadge, setBadges, mergeUserData, logoutUser } = userSlice.actions;

export default userSlice.reducer;