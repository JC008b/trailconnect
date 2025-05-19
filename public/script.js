let map;
let marker;

function initMap() {
  const defaultLocation = { lat: 20.6751707, lng: -103.3473385 }; // Guadalajara
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  google.maps.event.addListener(marker, 'dragend', function(evt){
    document.getElementById("lat").value = evt.latLng.lat();
    document.getElementById("lng").value = evt.latLng.lng();
  });
}

function buscarUbicacion() {
  const input = document.getElementById("location").value;
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=AIzaSyCRyFJCmQrVP99kjH7SboA-Wm3D_8BcStg`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "OK") {
        const loc = data.results[0].geometry.location;
        map.setCenter(loc);
        marker.setPosition(loc);
        document.getElementById("lat").value = loc.lat;
        document.getElementById("lng").value = loc.lng;
      } else {
        alert("Ubicación no encontrada. Intenta con otro nombre o código postal.");
      }
    });
}

document.getElementById("trailForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const datos = {
    name: document.getElementById("name").value,
    difficulty: document.getElementById("difficulty").value,
    description: document.getElementById("description").value,
    lat: document.getElementById("lat").value,
    lng: document.getElementById("lng").value,
  };

  fetch("/api/trails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
  .then(res => res.json())
  .then(data => {
    alert("Pista registrada con éxito");
    document.getElementById("trailForm").reset();
  })
  .catch(err => alert("Error al registrar pista"));
});


