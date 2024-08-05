import { NavigationActions } from "react-navigation";

let rootNavigator;

function setRootNavigator( navigatorRef ) {
    rootNavigator = navigatorRef;
}

function navigate( routeName, params ) {
    try {
        rootNavigator.dispatch(
            NavigationActions.navigate( {
                routeName,
                params,
            } ),
        );
    } catch ( error ) {
        console.log( "===== error =====", error );
    }
}

export default {
    navigate,
    setRootNavigator,
};
