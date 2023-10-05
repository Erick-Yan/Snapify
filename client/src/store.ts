import * as toolkitRaw from '@reduxjs/toolkit';

const { configureStore } = toolkitRaw;

const initialState = {
    isLoggedIn: false,
    token: null,
    userId: null,
    isLoading: false,
}

const handleLoginRequest = (state) => {
    return {
        ...state,
        isLoading: true,
    }
}

const handleLoginSuccess = (state, action) => {
    const { token } = action.payload
    return {
        ...state,
        isLoggedIn: true,
        token: token["token"],
        userId: token["userId"],
        isLoading: false,
    }
}

const handleLoginFailure = (state) => {
    return {
        ...state,
    }
}

const handleLogout = (state) => {
    return {
        ...state,
        isLoggedIn: false,
        token: null,
        userId: null,
        isLoading: false,
    }
}

const rootReducer = (state = initialState, action: { type: any; }) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return handleLoginRequest(state)
        case 'LOGIN_SUCCESS':
            return handleLoginSuccess(state, action)
        case 'LOGIN_FAILURE':
            return handleLoginFailure(state)
        case 'LOGOUT':
            return handleLogout(state)
        default:
            return state
    }
};

// Create the Redux store
const store = configureStore({reducer: rootReducer});

export default store;