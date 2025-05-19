let map;
let marker;

function initMap() {
  const defaultLocation = { lat: 20.6597, lng: -103.3496 }; // Guadalajara
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  updateLatLng(marker.getPosition());

  marker.addListener('dragend', function () {
    updateLatLng(marker.getPosition());
  });

  document.getElementById("searchBtn").addEventListener("click", searchLocation);
  document.getElementById("trailForm").addEventListener("submit", submitForm);
}

function updateLatLng(position) {
  document.getElementById("latitude").value = position.lat();
  document.getElementById("longitude").value = position.lng();
}

function searchLocation() {
  const address = document.getElementById("searchInput").value;
  if (!address.trim()) {
    Swal.fire("Campo vacío", "Ingresa una ubicación válida.", "warning");
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK" && results[0]) {
      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      updateLatLng(results[0].geometry.location);
    } else {
      Swal.fire("No se encontró ubicación", `No se encontró: ${address}`, "error");
    }
  });
}

function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    difficulty: form.difficulty.value,
    description: form.description.value,
    latitude: form.latitude.value,
    longitude: form.longitude.value,
  };

  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        Swal.fire("Pista registrada", "", "success");
        form.reset();
      } else {
        Swal.fire("Error", "No se pudo guardar la pista.", "error");
      }
    })
    .catch(err => {
      Swal.fire("Error del servidor", err.message, "error");
    });
}
