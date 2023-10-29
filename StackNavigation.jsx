import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, ProfileScreen } from './screens';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

const StackNavigation = () => {
    return (
        <Tab.Navigator
        tabBarHideOnKeyboard={true}
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "rgba(0,0,0,1)",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    shadowOpacity: 4,
                    shadowRadius: 4,
                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },
                    borderWidth: 0,
                },
                tabBarVisible: true,
                tabBarVisibleInPortrait: false,
                tabBarVisibleInLandscape: false,
                headerShown: false,
               
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: "Home",
                // tabBarShowLabel: false,
                tabBarLabelStyle: {color: "white"},
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Entypo name='home' size={24} color={'white'}/>
                    ) : (
                        <AntDesign name='home' size={24} color={'white'}/>
                    )
            }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                // tabBarShowLabel: false,
                tabBarLabel: "Profile",
                tabBarLabelStyle: {color: "white"},
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Ionicons name='person' size={24} color={'white'}/>
                    ) : (
                        <Ionicons name='person-outline' size={24} color={'white'}/>
                    ),
            }} />
        </Tab.Navigator>
    )
}

export default StackNavigation