// import axios from "axios"

const form = document.querySelector('form')!
const addressInput = document.getElementById('address')! as HTMLInputElement

const GOOGLE_API_KEY = 'Your_Google_Geocoding_API_KEY'

declare var google: any

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

// Simulate like Google Geocoding API
function searchAddressHandler (event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;
    if (enteredAddress) {
        // This is dummy coordinates
        const coordinates = {
                lat: 16.8409,
                lng: 96.1735
        }
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: coordinates,
            zoom: 16
        }); 

        new google.maps.Marker({ position: coordinates, map: map });
    } else {
        alert(`Please enter a address!`)
    }

//   axios
//     .get<GoogleGeocodingResponse>(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
//         enteredAddress
//       )}&key=${GOOGLE_API_KEY}`
//     )
//     .then(response => {
//       if (response.data.status !== "OK") {
//         throw new Error("Could not fetch location!");
//       }
//       const coordinates = response.data.results[0].geometry.location;
//       const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
//         center: coordinates,
//         zoom: 16
//       }); 

//       new google.maps.Marker({ position: coordinates, map: map });
//     })
//     .catch(err => {
//       alert(err.message);
//       console.log(err);
//     });
}

form.addEventListener('submit', searchAddressHandler)