/**
 * React Native App
 */
import React, { Component  } from "react";
import RNBootSplash from "react-native-bootsplash";
import NavigatorService from "./services/Navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import settings from "./config/settings";
import configureStore from "./config/store";
//import { firebase } from '@react-native-firebase/crashlytics';
import RootStack from "./config/routes"
import firebase from 'react-native-firebase';
export default class App extends Component {

    constructor( props ) {
        super( props );

        const { store, persistor } = configureStore();
        this.state = {
            store,
            persistor,
        };
        settings.persistor = persistor;
    }

    componentDidMount() {
        RNBootSplash.hide({ duration: 250 });
        firebase.analytics().setAnalyticsCollectionEnabled(true)
        }

    render() {
        return (
            <Provider store={ this.state.store }>
                <PersistGate persistor={ this.state.persistor }>
                    <RootStack
                            ref={ ( navigatorRef ) => {
                                NavigatorService.setRootNavigator( navigatorRef );
                            } }
                    />
                </PersistGate>
            </Provider>
        );
    }
}
