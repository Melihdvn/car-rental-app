import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { post } from "../../lib/api";

const Reservations = ({ navigation }) => {
  const route = useRoute();
  const userId = route.params?.userId;

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("You must log in to use this page.");
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await post("/getreservations", {
          user_id: userId,
        });
        if (response.success) {
          setReservations(response.reservations || []);
        } else {
          setError(response.message || "Failed to fetch reservations.");
        }
      } catch (error) {
        setError("An error occurred while fetching reservations.");
      }
    };

    fetchReservations();
  }, [userId]);

  const handleLogin = () => {
    navigation.replace("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <ScrollView style={styles.panel}>
        {userId ? (
          reservations.length > 0 ? (
            <View style={styles.infoContainer}>
              {reservations.map((reservation) => (
                <View key={reservation.reservation_id} style={styles.card}>
                  <Text style={styles.label}>Reservation ID</Text>
                  <Text style={styles.value}>{reservation.reservation_id}</Text>

                  <Text style={styles.label}>Vehicle ID</Text>
                  <Text style={styles.value}>{reservation.vehicle_id}</Text>

                  <Text style={styles.label}>Start Date</Text>
                  <Text style={styles.value}>{reservation.start_date}</Text>

                  <Text style={styles.label}>End Date</Text>
                  <Text style={styles.value}>{reservation.end_date}</Text>

                  <Text style={styles.label}>Total Price</Text>
                  <Text style={styles.value}>{reservation.total_price}</Text>

                  <Text style={styles.label}>Created At</Text>
                  <Text style={styles.value}>{reservation.created_at}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noReservations}>No reservations found.</Text>
          )
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  panel: {
    width: "100%",
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    borderRadius: 20,
    padding: 20,
    marginTop: 50,
  },
  infoContainer: {
    width: "100%",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    color: "#f40",
    fontSize: 18,
  },
  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  noReservations: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  loginButton: {
    height: 45,
    width: "80%",
    backgroundColor: "#cd4100",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  error: {
    color: "#cd4100",
    fontSize: 16,
    marginTop: 10,
  },
});

export default Reservations;
