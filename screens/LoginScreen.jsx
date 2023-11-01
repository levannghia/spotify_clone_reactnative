import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import reusable from '../components/reusable/reusable.style'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { getAccessToken } from '../api';
import { Audio } from 'expo-av/build';
// import * as AppAuth from "expo-app-auth"

WebBrowser.maybeCompleteAuthSession();
// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const LoginScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        const checkTokenValidity = async () => {
            const accessToken = await AsyncStorage.getItem("token");
            const expirationDate = await AsyncStorage.getItem("expirationDate");
            console.log("acess token",accessToken);
            // console.log("expiration date",expirationDate);
      
            if(accessToken && expirationDate){
              const currentTime = Date.now();
            //   console.log("time: ", currentTime);
              if(currentTime < parseInt(expirationDate)){
                // here the token is still valid
                navigation.replace("Main");
              } else {
                // token would be expired so we need to remove it from the async storage
                AsyncStorage.removeItem("token");
                AsyncStorage.removeItem("expirationDate");
              }
            }
        }
        
        checkTokenValidity()
        
    }, [])


    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'e3c66f5069114b5299972d01478907e3',
            scopes: ["user-read-email",
                "user-library-read",
                "user-read-recently-played",
                "user-top-read",
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public"],
            // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({
                scheme: 'exp://192.168.1.10:8081'
                // scheme: 'exp://192.168.1.59:8081'

            }),
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            const getData = async () => {
                try {
                    const data = await getAccessToken(code, 'exp://192.168.1.10:8081', 'e3c66f5069114b5299972d01478907e3', '20250319b41b4c0d90f23e3aa268b5be');
                    const { access_token, refresh_token, expires_in } = data;
                    const expirationDate = new Date().getTime() + parseInt(expires_in) * 1000;
                    // Lưu access_token vào AsyncStorage hoặc sử dụng nó theo nhu cầu của bạn.
                    AsyncStorage.setItem('token', access_token);
                    AsyncStorage.setItem("expirationDate",expirationDate.toString());
                    // console.log(expirationDate);
                    navigation.navigate("Main")                  
                } catch (error) {
                    console.error('Error while getting access token:', error);
                }
            };
    
            getData();
            
        }
    }, [response]);
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <SafeAreaView style={reusable.container}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 3 }}>
                    <Entypo style={{ alignSelf: "center" }} name="spotify" size={80} color="white" />
                    <Text style={{
                        color: "white",
                        fontSize: 35,
                        fontWeight: "bold",
                        alignSelf: "center",
                        textAlign: "center",
                        marginTop: 35,
                        paddingHorizontal: 30
                    }}
                    >
                        Milions of Songs Free on spotify
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 4 }}>
                    <Pressable
                        onPress={() => {
                            promptAsync();
                        }}
                        style={{
                            backgroundColor: '#1DB954',
                            padding: 10,
                            width: 300,
                            marginVertical: 10,
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 25,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text>Sign In with spotify</Text>
                    </Pressable>
                    <Pressable
                        style={{
                            padding: 10,
                            width: 300,
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 25,
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 10,
                            flexDirection: "row",
                            borderColor: "#C0C0C0",
                            borderWidth: 0.8
                        }}>
                        <MaterialIcons name="phone-android" size={24} color="white" />
                        <Text style={{ color: "white", flex: 1, textAlign: "center" }}>Countinue with phone number</Text>
                    </Pressable>
                    <Pressable style={{
                        padding: 10,
                        width: 300,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 10,
                        flexDirection: "row",
                        borderColor: "#C0C0C0",
                        borderWidth: 0.8
                    }}>
                        <AntDesign name="google" size={24} color="white" />
                        <Text style={{ color: "white", flex: 1, textAlign: "center" }}>Countinue with Google</Text>
                    </Pressable>
                    <Pressable style={{
                        padding: 10,
                        width: 300,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 10,
                        flexDirection: "row",
                        borderColor: "#C0C0C0",
                        borderWidth: 0.8
                    }}>
                        <AntDesign name="facebook-square" size={24} color="white" />
                        <Text style={{ color: "white", flex: 1, textAlign: "center" }}>Sign In with Facebook</Text>
                    </Pressable>
                </View>
                <View style={{ flex: 1 }} />
            </SafeAreaView>
        </LinearGradient>
    )
}

export default LoginScreen

    // const authenticate = async () => {
    //     const config = {
    //         issuer: "https://accounts.spotify.com",
    //         clientId: "e3c66f5069114b5299972d01478907e3",
    //         scopes: [
    //             "user-read-email",
    //             "user-library-read",
    //             "user-read-recently-played",
    //             "user-top-read",
    //             "playlist-read-private",
    //             "playlist-read-collaborative",
    //             "playlist-modify-public" // or "playlist-modify-private"
    //         ],
    //         redirectUrl:"exp://localhost:19002/--/spotify-auth-callback"
    //     }
    //     const result = await AppAuth.authAsync(config)
    //     console.log(result);
    // }

