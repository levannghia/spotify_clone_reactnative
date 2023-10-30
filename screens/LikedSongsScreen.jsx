import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar, ScrollView, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import reusable from '../components/reusable/reusable.style'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LikedSongsScreen = () => {
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    const [savedTracks, setSavedTracks] = useState([]);
    async function getSavedTracks() {
        const accessToken = await AsyncStorage.getItem("token")
        try {
            const response = await axios.get("https://api.spotify.com/v1/me/tracks", {
                offset: 0,
                limit: 50
            }, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            })
            const data = await response.json();
            setSavedTracks(data.items)
        } catch (error) {
            console.error(error.message);
        }


    }
    return (
        <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
            <StatusBar barStyle={"light-content"} backgroundColor={"#614385"} translucent />
            <SafeAreaView style={reusable.container}>
                <View>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1, marginTop: 50 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Pressable style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: "#42275a",
                            flex: 1,
                            padding: 10,
                            borderRadius: 5
                        }}>
                            <AntDesign name='search1' size={20} color={"white"} />
                            <TextInput value={input} onChange={(text) => setInput(text)} placeholder='Find in Liked songs' placeholderTextColor={"white"} style={{ color: "white" }} />
                        </Pressable>
                        <Pressable style={{
                            marginLeft: 10,
                            backgroundColor: "#42275a",
                            padding: 10,
                            borderRadius: 3,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Text style={{ color: "white" }}>Sort</Text>
                        </Pressable>
                    </View>
                    <View style={{ height: 50 }} />
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                            Liked Songs
                        </Text>
                        <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
                            430 songs
                        </Text>
                    </View>

                    <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Pressable
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: "#1DB954",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <AntDesign name="arrowdown" size={20} color="white" />
                        </Pressable>
                        <View
                            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                        >
                            <MaterialCommunityIcons
                                name="cross-bolnisi"
                                size={24}
                                color="#1DB954"
                            />
                            <Pressable
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#1DB954",
                                }}
                            >
                                <Entypo name="controller-play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default LikedSongsScreen

const styles = StyleSheet.create({})