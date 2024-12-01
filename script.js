document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const bookingSection = document.getElementById("booking-section");
  const mapSection = document.getElementById("map-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const loginForm = document.getElementById("login-form");
  const bookingForm = document.getElementById("booking-form");

  let map;
  let userMarker;
  let directionsService;
  let directionsRenderer;
  const userLocation = { lat: 37.7749, lng: -122.4194 }; // Mock User Location

  // Mock Login
  loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginSection.classList.add("hidden");
      bookingSection.classList.remove("hidden");
      mapSection.classList.remove("hidden");
      dashboardSection.classList.remove("hidden");
      initMap();
  });

  // Mock Booking
  bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Ambulance booked successfully!");
      bookingForm.reset();
  });

  // Initialize Map
  window.initMap = function () {
      map = new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: userLocation,
      });

      userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });

      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
      });

      findNearbyHospitals(userLocation);
  };

  // Find Nearby Hospitals
  function findNearbyHospitals(location) {
      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
          {
              location: location,
              radius: 5000, // 5 km radius
              type: "hospital",
          },
          (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                  let nearestHospital = results[0]; // Assuming the first result is the closest

                  results.forEach((place) => {
                      new google.maps.Marker({
                          position: place.geometry.location,
                          map: map,
                          title: place.name,
                          icon: "http://maps.google.com/mapfiles/ms/icons/hospitals.png",
                      });
                  });

                  calculateAndDisplayRoute(nearestHospital.geometry.location);
              } else {
                  console.error("Error fetching hospitals: ", status);
              }
          }
      );
  }

  // Calculate Shortest Route
  function calculateAndDisplayRoute(destination) {
      directionsService.route(
          {
              origin: userLocation,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING,
              drivingOptions: {
                  departureTime: new Date(), // Now
                  trafficModel: "best_guess",
              },
          },
          (response, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(response);
              } else {
                  console.error("Directions request failed: ", status);
              }
          }
      );
  }
});
