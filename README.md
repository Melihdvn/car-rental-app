# Car Rental Application

Welcome to the Car Rental Application! This project allows users to browse available vehicles, make reservations, and manage their bookings. It includes a backend API and a React Native mobile app.

## Features

- **User Registration and Login**: Users can register, log in, and manage their profiles.
- **Vehicle Listings**: Users can view available vehicles with details such as make, model, and daily rate.
- **Vehicle Reservation**: Users can select dates and rent vehicles.
- **Service Selection**: Users can add additional services to their reservation.
- **Payment Processing**: Users can enter credit card information and finalize reservations.

## Technologies Used

- **Backend**: Laravel (PHP)
- **Database**: SQLite
- **Frontend**: React Native (Expo)
- **API Requests**: Axios
- **Authentication**: Email-based login

## Setup and Installation

### Backend

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies:**

    ```bash
    composer install
    ```

3. **Set Up the Environment:**

 Generate the database with query in car-rental/database/schema.sql

6. **Start the Server:**

    ```bash
    php artisan serve
    ```

### Frontend

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the Development Server:**

    ```bash
    expo start
    ```

## API Endpoints

- **User Registration:**
    - `POST /api/register`
- **User Login:**
    - `POST /api/login`
- **Vehicle List:**
    - `GET /api/vehicles`
- **Create Reservation:**
    - `POST /api/createreservation`
- **Add Service to Reservation:**
    - `POST /api/addservice`
- **Get Available Vehicles on Date:**
    - `GET /api/getvehiclesondate`

## Application Screens

- **Login Screen**: Initial full-screen image with centered logo. The login form appears after pressing 'Continue'.
- **Profile Page**: Displays user information with editable fields and a semi-transparent background.
- **Vehicle List**: Shows a list of vehicles with images and details. Includes filters and a modal for renting.
- **Rent Vehicle**: Allows users to select dates and view available cars. 'Rent Now' navigates to the Payment Screen.
- **Payment Screen**: Users enter credit card details, add services, and complete their reservation.

## Contribution

This project is not open to contribution but i can get your recommendations via issues.

## Contact

For questions or feedback, please contact [melihdvn@gmail.com](mailto:melihdvn@gmail.com).

