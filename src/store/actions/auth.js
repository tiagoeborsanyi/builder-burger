import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return disptach => {
        setTimeout(() => {
            disptach(logout());
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`;
        if (!isSignup) {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`;
        }
        console.log(authData);
        axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err.response);
                dispatch(authFail(err.response.data.error));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () => {
    return disptach => {
        const token = localStorage.getItem('token');
        if (!token) {
            disptach(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                disptach(logout());
            } else {
                const userId = localStorage.getItem('userId');
                disptach(authSuccess(token, userId));
                disptach(checkAuthTimeout(expirationDate.getSeconds() - new Date().getSeconds()));
            }
        }
    }
}