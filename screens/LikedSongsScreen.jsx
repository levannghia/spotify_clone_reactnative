import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar, ScrollView, Image, Pressable, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import reusable from '../components/reusable/reusable.style'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SongItem from '../components/SongItem';
import { Player } from '../PlayerContext';
import { BottomModal, ModalContent } from "react-native-modals"

const LikedSongsScreen = () => {
    const navigation = useNavigation()
    const { currentTrack, setCurrentTrack } = useContext(Player)
    const [isPlaying, setIsPlaying] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [input, setInput] = useState('')
    const [savedTracks, setSavedTracks] = useState([]);
    async function getSavedTracks() {
        try {
            const accessToken = await AsyncStorage.getItem("token")
            const response = await axios.get("https://api.spotify.com/v1/me/tracks", {
                params: {
                    offset: 0,
                    limit: 50,
                },
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });

            const data = response.data;
            setSavedTracks(data.items);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getSavedTracks();
    }, [])

    const playTrack = async () => {
        if (savedTracks.length > 0) {
            setCurrentTrack(savedTracks[0])
        }

        await play(savedTracks[0])
    }

    const play = async () => {

    }

    console.log(savedTracks);
    return (
        <>
            <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
                <StatusBar barStyle={"light-content"} backgroundColor={"#614385"} translucent />
                <SafeAreaView style={reusable.container}>
                    <View>
                        <TouchableOpacity onPress={navigation.goBack}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginTop: 50 }}>
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
                                    onPress={playTrack}
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
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={savedTracks}
                            keyExtractor={item => item.track.uri}
                            renderItem={({ item }) => (<SongItem item={item} />)}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>
            {currentTrack && (
                <Pressable
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{
                        backgroundColor: "#5072A7",
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: 10,
                        marginBottom: 15,
                        position: 'absolute',
                        left: 20,
                        bottom: 10,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Image style={{ width: 40, height: 40 }} source={{ uri: currentTrack?.track?.album?.images[0].url }} />
                        <Text numberOfLines={1} style={{ fontSize: 13, width: 220, color: 'white', fontWeight: 'bold' }}>{currentTrack?.track?.name} * {currentTrack?.track?.artists[0].name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 8 }}>
                        <AntDesign name='heart' size={24} color={'#1DB954'} />
                        <Pressable>
                            <AntDesign name='pausecircle' size={24} color={'white'} />
                        </Pressable>
                    </View>
                </Pressable>
            )}

            <BottomModal
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(false)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
            >
                <ModalContent style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#5072A7"
                }}>
                    <View style={{ flex: 1, marginTop: 20 }}>
                        <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <AntDesign name='down' size={24} color="white" />
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: "white" }}>{currentTrack?.track?.name}</Text>
                            <Entypo name='dots-three-vertical' size={24} color="white" />
                        </Pressable>
                        <View style={{ flex: 1 }} />
                        <View style={{ flex: 7 }}>
                            <Image style={{
                                width: "100%",
                                height: 330,
                                borderRadius: 5,
                            }}
                                source={{ uri: currentTrack?.track?.album?.images[0].url }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 20 }}>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{currentTrack?.track?.name}</Text>
                                    <Text style={{ marginTop: 4, color: "#D3D3D3" }}>{currentTrack?.track?.artists[0].name}</Text>
                                </View>
                                <AntDesign name='heart' size={24} color="#1DB954" />
                            </View>
                            <View>
                                <Text style={{ marginTop: 10 }}>Progess bar</Text>
                                <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                    <Text style={styles.textTime}>0:00</Text>
                                    <Text style={styles.textTime}>0:30</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flex: 3
                            }}
                        >
                            <Pressable>
                                <FontAwesome name="arrows" size={30} color="#03C03C" />
                            </Pressable>
                            <Pressable>
                                <Ionicons name="play-skip-back" size={30} color="white" />
                            </Pressable>
                            <Pressable>
                                {isPlaying ? (
                                    <AntDesign name="pausecircle" size={60} color="white" />
                                ) : (
                                    <Pressable
                                     
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: "white",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Entypo name="controller-play" size={26} color="black" />
                                    </Pressable>
                                )}
                            </Pressable>
                            <Pressable>
                                <Ionicons name="play-skip-forward" size={30} color="white" />
                            </Pressable>
                            <Pressable>
                                <Feather name="repeat" size={30} color="#03C03C" />
                            </Pressable>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    )
}

export default LikedSongsScreen

const styles = StyleSheet.create({
    textTime: {
        color: '#D3D3D3',
        fontSize: 15
    }
})