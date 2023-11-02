import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar, ScrollView, ActivityIndicator, Image, Pressable, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import reusable from '../components/reusable/reusable.style'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SongItem from '../components/SongItem';
import { Player } from '../PlayerContext';
import { BottomModal, ModalContent } from "react-native-modals"
import { Audio } from 'expo-av/build';
import { debounce } from 'lodash';

const LikedSongsScreen = () => {
    const navigation = useNavigation()
    const { currentTrack, setCurrentTrack } = useContext(Player)
    const [isPlaying, setIsPlaying] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [searchedTrack, setSearchedTrack] = useState([])
    const [input, setInput] = useState('')
    const [currentSound, setCurrentSound] = useState(null);
    const [progress, setProgress] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [savedTracks, setSavedTracks] = useState([]);
    const value = useRef(0);
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

    const handlePlayPause = async () => {
        if (currentSound) {
            if (isPlaying) {
                await currentSound.pauseAsync();
            } else {
                await currentSound.playAsync();
            }
            setIsPlaying(!isPlaying)
        }
    }

    const playTrack = async () => {
        if (savedTracks.length > 0) {
            setCurrentTrack(savedTracks[0])
        }

        await play(savedTracks[0])
    }

    const play = async (nextTrack) => {
        // console.log(nextTrack);
        const preview_url = nextTrack?.track?.preview_url;
        try {
            if (currentSound) {
                await currentSound.stopAsync();
            }

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
            });

            const { sound, status } = await Audio.Sound.createAsync(
                {
                    uri: preview_url,
                },
                {
                    shouldPlay: true,
                    isLooping: false,
                },
                onPlaybackStatusUpdate
            );
            console.log(sound);
            onPlaybackStatusUpdate(status);
            setCurrentSound(sound);
            setIsPlaying(status.isLoaded);
            await sound.playAsync();
        } catch (error) {
            console.error(error.message);
        }
    }

    const onPlaybackStatusUpdate = async (status) => {
        console.log("satus", status);
        if (status.isLoaded && status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            // console.log("progress: ", progress);
            setProgress(progress);
            setTotalDuration(status.durationMillis);
            setCurrentTime(status.positionMillis);
        }

        if (status.didJustFinish === true) {
            setCurrentSound(null)
            playNextTrack()
        }
    }

    const playNextTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
        }
        value.current += 1

        if (value.current < savedTracks.length) {
            const nextTrack = savedTracks[value.current];
            setCurrentTrack(nextTrack)
            await play(nextTrack)
        } else {
            console.log("end of playlist");
        }
    }

    const playPreviousTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current -= 1;
        if (value.current < savedTracks.length) {
            const nextTrack = savedTracks[value.current];
            setCurrentTrack(nextTrack);

            await play(nextTrack);
        } else {
            console.log("end of playlist");
        }
    };

    const debouncedSearch = debounce(handleSearch, 800);

    function handleSearch(text) {
        const filteredTracks = savedTracks.filter((item) =>
            item.track.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchedTrack(filteredTracks)
    }

    const handleInputChange = (text) => {
        setInput(text)
        debouncedSearch(text)
    }

    useEffect(() => {
        if (savedTracks.length > 0) {
            handleSearch(input)
        }
    }, [savedTracks])

    const circleSize = 12
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <>
            <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
                <StatusBar barStyle={"light-content"} backgroundColor={modalVisible ? "#5072A7" : "#614385"} translucent />
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
                                <TextInput value={input} onChangeText={(text) => handleInputChange(text)} placeholder='Find in Liked songs' placeholderTextColor={"white"} style={{ color: "white" }} />
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
                                {searchedTrack.length} songs
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
                        {searchedTrack.length === 0 ? (
                            <ActivityIndicator size="large" color="gray" />
                        ) : (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={searchedTrack}
                                keyExtractor={item => item.track.uri}
                                renderItem={({ item }) => (<SongItem item={item} onPress={play} isPlaying={item === currentTrack} />)}
                            />
                        )}

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
                        <Text numberOfLines={1} style={{ fontSize: 13, width: "60%", color: 'white', fontWeight: 'bold' }}>{currentTrack?.track?.name} * {currentTrack?.track?.artists[0].name}</Text>
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
                            <AntDesign name='down' size={24} color="white" onPress={() => setModalVisible(false)} />
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
                                <View style={{ marginTop: 10 }}>
                                    <View
                                        style={{
                                            width: "100%",
                                            marginTop: 10,
                                            backgroundColor: "gray",
                                            height: 3,
                                            borderRadius: 5
                                        }}
                                    >
                                        <View style={[styles.progressbar, { width: `${progress * 100}%` }]} />
                                        <View style={[
                                            {
                                                position: "absolute",
                                                top: -5,
                                                width: circleSize,
                                                height: circleSize,
                                                borderRadius: circleSize / 2,
                                                backgroundColor: "white"
                                            },
                                            {
                                                left: `${progress * 100}%`,
                                                marginLeft: -circleSize / 2
                                            }
                                        ]} />
                                    </View>
                                </View>
                                <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                    <Text style={styles.textTime}>{formatTime(currentTime)}</Text>
                                    <Text style={styles.textTime}>{formatTime(totalDuration)}</Text>
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
                            <Pressable onPress={playPreviousTrack}>
                                <Ionicons name="play-skip-back" size={30} color="white" />
                            </Pressable>
                            <Pressable onPress={handlePlayPause}>
                                {isPlaying ? (
                                    <AntDesign name="pausecircle" size={60} color="white" />
                                ) : (
                                    <Pressable
                                        onPress={handlePlayPause}
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
                            <Pressable onPress={playNextTrack}>
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
    },
    progressbar: {
        height: "100%",
        backgroundColor: "white",
    },
})