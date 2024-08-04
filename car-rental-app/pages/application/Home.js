import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Home = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("My Reservations")}
        >
          <View style={styles.iconContainer}>
            <Icon name="calendar-today" size={40} color="#cd4100" />
          </View>
          <Text style={styles.cardText}>Manage Your Reservations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Rent Vehicle")}
        >
          <View style={styles.iconContainer}>
            <Icon name="directions-car" size={40} color="#cd4100" />
          </View>
          <Text style={styles.cardText}>Find Your Ideal Rental</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Vehicle List")}
        >
          <View style={styles.iconContainer}>
            <Icon name="car-repair" size={40} color="#cd4100" />
          </View>
          <Text style={styles.cardText}>Explore Our Vehicle Fleet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.iconContainer}>
            <Icon name="person" size={40} color="#cd4100" />
          </View>
          <Text style={styles.cardText}>Update Your Profile</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  iconContainer: {
    backgroundColor: "#fff2",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardText: {
    color: "#f5f5f5",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 24,
  },
});

export default Home;
