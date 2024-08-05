import { createStore, applyMiddleware } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";

import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";

import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "../reducers";
import rootSaga from "../services/sagas";

import { LOGOUT_REQUEST } from "../actions/session";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["session"]
};

const persistReducer = persistCombineReducers(persistConfig, reducers);

const rootReducer = (state, action) => {
  if (state && "_persist" in state && state._persist === undefined) {
    const { _persist, ...stateWithoutPersist } = state;
    return persistReducer(stateWithoutPersist, action);
  }
  if (action.type === LOGOUT_REQUEST) {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });
    return persistReducer(undefined, action);
  }

  return persistReducer(state, action);
};

const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  sagaMiddleware.run(rootSaga);
  const persistor = persistStore(store);
  return {
    store,
    persistor
  };
};

export default configureStore;
