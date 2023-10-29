import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const ArtistCard = ({item}) => {
  return (
    <View style={{margin: 10}}>
      <Image style={{width: 130, height: 130, borderRadius: 5}}
        source={{uri: item.track.preview_url}}
      />
      <Text>{item?.name}</Text>
    </View>
  )
}

export default ArtistCard

const styles = StyleSheet.create({})