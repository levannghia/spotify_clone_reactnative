import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import reusable from '../components/reusable/reusable.style'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import ArtistCard from '../components/ArtistCard'
import RecentlyPlayedCard from '../components/RecentlyPlayedCard'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({})
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const getMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  const message = getMessage();
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      const data = await response.data;
      setUserProfile(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getProfile();
  }, [])

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=4", {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      const tracks = response.data?.items;
      setRecentlyPlayed(tracks);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getRecentlyPlayedSongs()
  }, [])

  useEffect(() => {
    const getTopItem = async () => {
      const accessToken = await AsyncStorage.getItem('token');
      try {
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }

        const type = "artists";
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })

        const artists = response.data.items;
        console.log(artists);
        // setTopArtists(artists);
      } catch (error) {
        console.error(error.message);
      }
    }

    getTopItem();
  }, [])

  // console.log(userProfile);
  // console.log("artists", recentlyPlayed);

  const renderItem = ({ item }) => (
    <Pressable
      key={item.track.uri}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
        marginVertical: 8,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "#202020"
      }}>
      <Image style={{
        width: 55,
        height: 55,
      }} source={{ uri: item.track.album.images && item.track.album.images[0].url }} />
      <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
        <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{item.track.name}</Text>
      </View>
    </Pressable>
  )

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView style={reusable.container}>
        <ScrollView>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: 'center'
              }}
                source={{
                  uri: userProfile.images && userProfile.images[0]?.url
                }}
              />
              <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "bold", color: "white" }}>{message}</Text>
            </View>
            <MaterialCommunityIcons name='lightning-bolt-outline' size={24} color={"white"} />
          </View>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginVertical: 10 }}>
            <Pressable style={{ backgroundColor: '#282828', padding: 10, borderRadius: 30 }}>
              <Text style={{ fontSize: 15, color: 'white' }}>Music</Text>
            </Pressable>
            <Pressable style={{ backgroundColor: '#282828', padding: 10, borderRadius: 30 }}>
              <Text style={{ fontSize: 15, color: 'white' }}>Pobcasts & Shows</Text>
            </Pressable>
          </View>
          <View style={{ height: 10 }} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <Pressable
              onPress={() => navigation.navigate('Liked')}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
                marginVertical: 8,
                borderRadius: 4,
                elevation: 3,
                backgroundColor: "#202020"
              }}>
              <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                <Pressable style={{ width: 55, height: 55, justifyContent: "center", alignItems: "center" }}>
                  <AntDesign name='heart' size={24} color={"#ffffff"} />
                </Pressable>
              </LinearGradient>
              <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "bold" }}>Liked Songs</Text>
            </Pressable>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginVertical: 8,
              borderRadius: 4,
              elevation: 3,
              backgroundColor: "#202020"
            }}>
              <Image style={{ width: 55, height: 55 }} source={{ uri: "https://i.pravatar.cc/100" }} />
              <View>
                <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "bold" }}>Hiphop Tamhiza</Text>
              </View>
            </View>
          </View>
          {/* <FlatList
            // horizontal
            data={recentlyPlayed}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            keyExtractor={item => item.track.uri}
            renderItem={renderItem}
          /> */}

          {recentlyPlayed.map(item => (
            renderItem({ item })
          ))}

          <Text style={{ color: "white", fontSize: 19, fontWeight: "bold", marginTop: 10 }}>Your Top Artists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {topArtists.map((item, index) => {
              <ArtistCard item={item} key={index} />
            })}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topArtists.map((item, index) => (
              <ArtistCard item={item} key={index} />
            ))}
          </ScrollView>

          <View style={{ height: 10 }} />
          <Text
            style={{
              color: "white",
              fontSize: 19,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Recently Played
          </Text>
          <FlatList
            data={recentlyPlayed}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <RecentlyPlayedCard item={item} key={index} />
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})