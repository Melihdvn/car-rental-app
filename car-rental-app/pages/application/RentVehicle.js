import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { post } from "../../lib/api";
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";

const RentVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rentalDetails, setRentalDetails] = useState(null); // State for rental details
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const route = useRoute();
  const userId = route.params.userId;

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    if (showStartDatePicker) {
      setStartDate(currentDate);
      setShowStartDatePicker(false);
    } else {
      setEndDate(currentDate);
      setShowEndDatePicker(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await post("/getvehiclesondate", {
        start_date: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        end_date: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      });
      if (response.success) {
        setVehicles(response.vehicles || []);
      } else {
        setError(response.message || "Failed to fetch vehicles.");
      }
    } catch (error) {
      setError("An error occurred while fetching vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchVehicles = () => {
    fetchVehicles();
    setShowVehicleList(true);
  };

  const images = {
    "camry.jpg": require("../../assets/camry.jpg"),
    "civic.jpg": require("../../assets/civic.jpg"),
    "mustang.jpg": require("../../assets/mustang.jpg"),
    "malibu.jpg": require("../../assets/malibu.jpg"),
    "bmw_3series.jpg": require("../../assets/bmw_3series.jpg"),
    "audi_a4.jpg": require("../../assets/audi_a4.jpg"),
    "outlander.jpg": require("../../assets/outlander.jpg"),
    "elantra.jpg": require("../../assets/elantra.jpg"),
    "mini.jpg": require("../../assets/mini.jpg"),
    "mazda6.jpg": require("../../assets/mazda6.jpg"),
  };

  const getImage = (imageName) => {
    return images[imageName];
  };

  const handleRentNow = (item) => {
    const totalPrice =
      item.daily_rate *
      ((endDate - startDate) / (1000 * 60 * 60 * 24)).toFixed(2);
    setRentalDetails({
      vehicle: item,
      startDate,
      endDate,
      totalPrice,
    });
    setModalVisible(true); // Show the modal with rental details
  };

  const handleReturn = () => {
    setShowVehicleList(false);
  };

  const handlePayment = async () => {
    if (rentalDetails) {
      try {
        const response = await post("/createreservation", {
          user_id: userId,
          vehicle_id: rentalDetails.vehicle.vehicle_id,
          start_date: rentalDetails.startDate.toISOString().split("T")[0],
          end_date: rentalDetails.endDate.toISOString().split("T")[0],
          total_price: rentalDetails.totalPrice,
        });

        if (response.success) {
          alert("Reservation created successfully.");
          setRentalDetails(null);
          setModalVisible(false);
          fetchVehicles();
        } else {
          alert(response.message || "Failed to create reservation.");
        }
      } catch (error) {
        alert("An error occurred while creating the reservation.");
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Image source={getImage(item.image)} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.makeModel}>{`${item.make} ${item.model}`}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Icon name="gas-pump" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.fuel}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="atom" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.transmission}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="calendar" size={20} width={20} color="#cd4100" />
            <Text style={styles.detailText}>{item.year}</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="dollar-sign" size={20} width={11} color="#cd4100" />
            <Text style={styles.detailText}>{item.daily_rate} / day</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => handleRentNow(item)}
        >
          <Text style={styles.rentButtonText}>Make Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      {showVehicleList && (
        <TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
          <Icon name="angle-left" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.returnButtonText}>Return</Text>
        </TouchableOpacity>
      )}
      <View style={styles.panel}>
        {!showVehicleList ? (
          <>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Select Start Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {startDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  textColor="white"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date)}
                />
              )}
              <Text style={styles.dateText}>Select End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {endDate.toDateString()}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  textColor="white"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date)}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchVehicles}
            >
              <Text style={styles.searchButtonText}>Search Vehicles</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {loading ? (
              <ActivityIndicator size="large" color="#cd4100" />
            ) : vehicles.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={vehicles}
                renderItem={renderItem}
                keyExtractor={(item) => item.vehicle_id.toString()}
              />
            ) : (
              <Text style={styles.error}>
                {error || "No vehicles available."}
              </Text>
            )}
          </>
        )}
      </View>

      {/* Rental Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rental Details</Text>
            {rentalDetails && (
              <>
                <Image
                  source={getImage(rentalDetails.vehicle.image)}
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>
                  Vehicle: {rentalDetails.vehicle.make}{" "}
                  {rentalDetails.vehicle.model}
                </Text>
                <Text style={styles.modalText}>
                  Start Date: {rentalDetails.startDate.toDateString()}
                </Text>
                <Text style={styles.modalText}>
                  End Date: {rentalDetails.endDate.toDateString()}
                </Text>
                <Text style={styles.modalText}>
                  Total Price: ${rentalDetails.totalPrice.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={handlePayment}
                >
                  <Text style={styles.paymentButtonText}>Reserve</Text>
                </TouchableOpacity>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#222f",
    borderRadius: 20,
    padding: 20,
    marginTop: "20%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dateContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dateText: {
    color: "#fff",
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: "#cd4100",
    padding: 10,
    borderRadius: 10,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  vehicleCard: {
    backgroundColor: "#333",
    marginBottom: 15,
    borderRadius: 10,
    width: "100%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleImage: {
    width: "80%",
    resizeMode: "contain",
    height: 160,
  },
  vehicleInfo: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  makeModel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#444",
    paddingHorizontal: 2,
    borderRadius: 10,
  },
  detail: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  detailText: {
    color: "#ccc",
    marginHorizontal: 10,
    flexShrink: 1,
  },
  rentButton: {
    backgroundColor: "#cd4100",
    padding: 10,
    margin: 9,
    borderRadius: 5,
    alignItems: "center",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "#f00",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#222f",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  paymentButton: {
    backgroundColor: "#cd4100",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    marginTop: 35,
  },
  returnButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default RentVehicle;
