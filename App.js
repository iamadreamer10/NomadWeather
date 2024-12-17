import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions, View, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Fontisto from '@expo/vector-icons/Fontisto';

const SCREEN_WIDTH = Dimensions.get('window').width;
const API_KEY = '39f2d3413a69b0c9a255b0f14a8fa5bb'

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.list);
  }
  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <StatusBar style='light'></StatusBar>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <Text style={styles.timeText}>{day.dt_txt.split(" ")[0]}</Text>
              <Text style={styles.timeText}>{day.dt_txt.split(" ")[1].substring(0, 5)}</Text>
              <View style={{
                flexDirection: "row",
                alignItems: 'center',
                width: "100%",
                justifyContent: "space-between",
              }}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={60} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: 'white'
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'left',
    padding: 20
  },
  temp: {
    marginTop: 30,
    fontSize: 100,
    color: 'white'
  },
  description: {
    marginTop: -20,
    fontSize: 50,
    color: 'white'
  },
  tinyText: {
    fontSize: 20,
    color: 'white'

  },
  timeText: {
    fontSize: 30,
    color: 'white'
  }

});
