import React from "react";
import { View } from "react-native";
import {
    createSwitchNavigator,
    createStackNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
import HeaderCourseCurrent from "../screens/Courses/components/header";
import {
    AuthLoader,
    Login,
    Home,
    Sinfo,
    Links,
    Account,
    CardPhoto,
    BirthdayList,
    Logout,
    News,
    CurrentCourses,
    HistoryCourses,
    ClassTime,
    NewsItemView,
    PaymentSchedule,
    BankSelect,
    OtherPeriods,
    ScheduleCourse,
    Assistance,
    ForceUpdate,
    Notifications,
    NotificationConfiguration,
    CourseDetail,
    HistoryDetail,
    WalkThough,
    MapsScreen,
    PlacesList
} from "../screens";
import { BackButton } from "../components";
import {
    PersonalData, CareerData, Version, Terms,
} from "../screens/Account/Screens";
import { colors } from "./styles";

const HistoryStack = createStackNavigator(
    {
        HistoryCourses: {
            screen: HistoryCourses,
        },
        HistoryDetail: {
            screen: HistoryDetail,
        },
    },
    {
        headerMode: "none",
        initialRouteName: "HistoryCourses",
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
    },
);

const CoursesStack = createMaterialTopTabNavigator(
    {
        CurrentCourses: {
            screen: CurrentCourses,
            navigationOptions: () => ({
                title: "En Progreso",
            }),
        },
        HistoryStack: {
            screen: HistoryStack,
            navigationOptions: () => ({
                title: "Histórico",
            }),
        },
    },
    {
        title: "Mis Cursos",
        initialRouteName: "CurrentCourses",
        lazy: true,
        tabBarOptions: {
            activeTintColor: colors.$senatiWhite,
            inactiveTintColor: "white",
            labelStyle: {
                fontSize: 15,
                fontWeight: "bold",
            },
            style: {
                backgroundColor: colors.$senatiBlue,
            },
            indicatorStyle: {
                backgroundColor: colors.$senatiWhite,
            },
        },
    },
);
const CurrentDetail = createMaterialTopTabNavigator(
    {
        CourseDetail: {
            screen: CourseDetail,
            navigationOptions: () => ({
                title: "Detalle",
            }),
        },
        CourseSchedules: {
            screen: ScheduleCourse,
            navigationOptions: () => ({
                title: "Horario",
            }),
        },
        Assistance: {
            screen: Assistance,
            navigationOptions: () => ({
                title: "Asistencia",
            }),
        },
    },
    {
        title: "Mis Cursos",
        initialRouteName: "CourseDetail",
        lazy: true,
        tabBarOptions: {
            activeTintColor: colors.$senatiWhite,
            inactiveTintColor: "white",
            labelStyle: {
                fontSize: 15,
                fontWeight: "bold",
            },
            style: {
                backgroundColor: colors.$senatiBlue,
            },
            indicatorStyle: {
                backgroundColor: colors.$senatiWhite,
            },
        },
    },
);
const AppStack = createStackNavigator(
    {
        Home: {
            screen: Home,
            // navigationOptions: () => ( {
            //     header: null,
            // } ),
        },
        Links: {
            screen: Links,
            navigationOptions: {
                headerTitle: "Enlaces",
            },
        },

        News: {
            screen: News,
            navigationOptions: {
                headerTitle: "Noticias",
            },
        },

        NewsDetails: {
            screen: NewsItemView,
            navigationOptions: {
                headerTitle: "Noticias",
            },
        },

        Sinfo: {
            screen: Sinfo,
            navigationOptions: () => ({
                // we made a custom local Header for this component
                // because we must interact with the webview
                header: null,
            }),
        },

        Fotocheck: {
            screen: CardPhoto,
            navigationOptions: () => ({
                // we made a custom local Header for this component
                // because we must interact with the webview
                header: null,
            }),
        },

        Birthdays: {
            screen: BirthdayList,
            navigationOptions: {
                headerTitle: "Cumpleaños",
            },
        },

        CoursesStack: {
            screen: CoursesStack,
            navigationOptions: {
                headerTitle: "Mis Cursos",
            },
        },

        CourseDetail: {
            screen: CourseDetail,
            navigationOptions: {
                headerTitle: "Detalle del curso",
            },
        },

        ClassTimes: {
            screen: ClassTime,
            navigationOptions: () => ({
                // header: null,
            }),
        },

        Account: {
            screen: Account,
            navigationOptions: {
                headerTitle: "Mi Cuenta",
            },
        },

        PersonalData: {
            screen: PersonalData,
            navigationOptions: {
                headerTitle: "Datos Personales",
            },
        },

        CareerData: {
            screen: CareerData,
            navigationOptions: {
                headerTitle: "Datos de Carrera",
            },
        },

        Version: {
            screen: Version,
            navigationOptions: {
                headerTitle: "Versión Actual",
            },
        },

        Terms: {
            screen: Terms,
            navigationOptions: {
                headerTitle: "Términos de uso ",
            },
        },

        PaymentSchedule: {
            screen: PaymentSchedule,
            navigationOptions: () => ({
                // we made a custom local Header for this component
                // because we must interact with the webview
                header: null,
            }),
        },

        BankSelect: {
            screen: BankSelect,
            navigationOptions: {
                headerTitle: "Listado de bancos",
            },
        },

        OtherPeriods: {
            screen: OtherPeriods,
            navigationOptions: {
                headerTitle: "Otros periodos",
            },
        },

        CurrentDetail: {
            screen: CurrentDetail,
            navigationOptions: ({ navigation }) => ({
                headerTitle: "CURSO",
                // we made a custom local Header for this component
                // because we must interact with the webview
                headerRight: (
                    <HeaderCourseCurrent
                        funct={() => {
                            navigation.navigate("ClassTimes");
                        }}
                    />
                ),
            }),
        },
        Notifications: {
            screen: Notifications,
            navigationOptions: () => ({
                // we made a custom local Header for this component
                // because we must interact with the webview
                header: null,
            }),
        },

        NotificationConfiguration: {
            screen: NotificationConfiguration,
            navigationOptions: {
                headerTitle: "Configurar notificaciones",
            },
        },
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: colors.$blue,
            },
            headerTitleStyle: {
                textAlign: "center",
                color: colors.$white,
                fontSize: 18,
            },
            headerTitleContainerStyle: {
                justifyContent: "center",
            },
            headerBackTitle: null,
            headerTintColor: "white",
            headerBackImage: <BackButton />,
            headerRight: <View />,
            gesturesEnabled: true,
        },
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
    },
);

const AuthStack = createStackNavigator(
    {
        Login: {
            screen: Login,
            path: "account/SignIn",
            navigationOptions: () => ({
                header: null,
            }),
        },
        Logout: {
            screen: Logout,
            path: "account/Logout",
            navigationOptions: () => ({
                header: null,
            }),
        },
        MapsScreen: {
            screen: MapsScreen,
            path: "account/Maps",
            navigationOptions: {
                headerTitle: "Mapa",
            },
        },
        PlacesList: {
            screen: PlacesList,
            path: "account/PlacesList",
            navigationOptions: {
                headerTitle: "Listado de Sedes",
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: colors.$blue,
            },
            headerTitleStyle: {
                textAlign: "center",
                color: colors.$white,
                fontSize: 18,
            },
            headerTitleContainerStyle: {
                justifyContent: "center",
            },
            headerBackTitle: null,
            headerTintColor: "white",
            headerBackImage: <BackButton />,
            headerRight: <View />,
            gesturesEnabled: true,
        },
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
    },

    // {
    //     headerMode: "none",
    // },
);

const RootStack = createAppContainer(createSwitchNavigator(
    {
        AuthLoader,
        App: AppStack,
        Auth: AuthStack,
        Walk: WalkThough,
        UpdatedApp: ForceUpdate,
    },
    {
        initialRouteName: "AuthLoader",
    },
)
);

export default RootStack;
