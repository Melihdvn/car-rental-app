import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { post, get } from "../../lib/api";

const Reservations = ({ navigation }) => {
  const route = useRoute();
  const userId = route.params?.userId;

  const [reservations, setReservations] = useState([]);
  const [services, setServices] = useState({});
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    if (!userId) return;

    try {
      const response = await post("/getreservations", { user_id: userId });
      if (response.success) {
        setReservations(response.reservations || []);
      } else {
        setError(response.message || "Failed to fetch reservations.");
      }
    } catch (error) {
      setError("An error occurred while fetching reservations.");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await get("/getallreservationservices");
      if (response.success) {
        const servicesMap = response.services.reduce((acc, service) => {
          acc[service.additional_service_id] = service;
          return acc;
        }, {});
        setServices(servicesMap);
      } else {
        setError(response.message || "Failed to fetch services.");
      }
    } catch (error) {
      setError("An error occurred while fetching services.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
      fetchServices();
    }, [userId])
  );

  const vehicleImages = {
    1: require("../../assets/camry.jpg"),
    2: require("../../assets/civic.jpg"),
    3: require("../../assets/mustang.jpg"),
    4: require("../../assets/malibu.jpg"),
    5: require("../../assets/bmw_3series.jpg"),
    6: require("../../assets/audi_a4.jpg"),
    7: require("../../assets/outlander.jpg"),
    8: require("../../assets/elantra.jpg"),
    9: require("../../assets/mini.jpg"),
    10: require("../../assets/mazda6.jpg"),
  };

  const getImageByVehicleId = (vehicleId) => {
    return vehicleImages[vehicleId];
  };

  const handleLogin = () => {
    navigation.replace("Login");
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {userId ? (
          reservations.length > 0 ? (
            <View style={styles.infoContainer}>
              {reservations.map((reservation, index) => (
                <View
                  key={reservation.reservation_id}
                  style={[styles.card, index % 2 !== 0 && { marginLeft: 10 }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.label}>Reservation ID:</Text>
                    <Text style={styles.value}>
                      {reservation.reservation_id}
                    </Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.label}>Vehicle ID:</Text>
                    <Text style={styles.value}>{reservation.vehicle_id}</Text>
                    <Text style={styles.label}>Start Date:</Text>
                    <Text style={styles.value}>{reservation.start_date}</Text>
                    <Text style={styles.label}>End Date:</Text>
                    <Text style={styles.value}>{reservation.end_date}</Text>
                    <Text style={styles.label}>Total Price:</Text>
                    <Text style={styles.value}>
                      ${reservation.total_price.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => handleViewDetails(reservation)}
                    >
                      <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noReservations}>No reservations found.</Text>
          )
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.loginButtonText}>
              You must Login to see your reservations.
            </Text>
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      {selectedReservation && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image
                source={getImageByVehicleId(selectedReservation.vehicle_id)}
                style={styles.vehicleImage}
              />
              <Text style={styles.title}>Reservation Details</Text>
              <Text style={styles.label}>
                Vehicle ID:{" "}
                <Text style={styles.value}>
                  {selectedReservation.vehicle_id}
                </Text>
              </Text>
              <Text style={styles.label}>
                Start Date:{" "}
                <Text style={styles.value}>
                  {selectedReservation.start_date}
                </Text>
              </Text>
              <Text style={styles.label}>
                End Date:{" "}
                <Text style={styles.value}>{selectedReservation.end_date}</Text>
              </Text>
              <Text style={styles.label}>
                Total Price:{" "}
                <Text style={styles.value}>
                  ${selectedReservation.total_price.toFixed(2)}
                </Text>
              </Text>

              <Text style={styles.subtitle}>Included Services:</Text>
              {Object.values(services)
                .filter(
                  (service) =>
                    service.reservation_id ===
                    selectedReservation.reservation_id
                )
                .map((service) => (
                  <Text key={service.rs_id} style={styles.serviceText}>
                    {service.name} ($
                    {service.price.toFixed(2)})
                  </Text>
                ))}

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  scrollViewContent: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "rgba(34, 34, 34, 0.6)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    marginBottom: 10,
    width: 175,
    minHeight: 180,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    color: "#cd4100",
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  noReservations: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  loginButton: {
    height: 45,
    width: 200,
    backgroundColor: "#cd4100",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  error: {
    color: "#cd4100",
    fontSize: 16,
    marginTop: 10,
  },
  detailsButton: {
    backgroundColor: "#cd4100",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    color: "white",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(34, 34, 34, 0.9)",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
    alignItems: "center",
  },
  vehicleImage: {
    height: 150,
    width: "88%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#cd4100",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  serviceText: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#cd4100",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Reservations;
