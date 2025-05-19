let mapa;
let marcador;
let pistas = [];

function inicializarMapa() {
  const centroInicial = { lat: 20.659698, lng: -103.349609 }; // Guadalajara

  mapa = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: centroInicial,
  });

  marcador = new google.maps.Marker({
    position: centroInicial,
    map: mapa,
    draggable: true,
  });

  marcador.addListener("dragend", () => {
    const pos = marcador.getPosition();
    console.log("Marcador movido a:", pos.lat(), pos.lng());
  });

  manejarFormulario();
}

function buscarUbicacion() {
  const direccion = document.getElementById("busqueda").value;

  if (!direccion) {
    alert("Ingresa una ubicación");
    return;
  }

  const claveApi = "AIzaSyAIiUn3D-7v1lS8pCk1rMq-JRS1jZyFljE";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${claveApi}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === "OK") {
        const ubicacion = data.results[0].geometry.location;
        mapa.setCenter(ubicacion);
        marcador.setPosition(ubicacion);
      } else {
        alert("No se encontró la ubicación.");
      }
    })
    .catch(err => console.error("Error al buscar ubicación:", err));
}

function manejarFormulario() {
  document.getElementById("formulario").addEventListener("submit", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const dificultad = document.getElementById("dificultad").value;
    const descripcion = document.getElementById("descripcion").value;
    const posicion = marcador.getPosition();

    const nuevaPista = {
      nombre,
      dificultad,
      descripcion,
      lat: posicion.lat(),
      lng: posicion.lng(),
    };

    // Aquí haces POST al backend si ya está conectado
    fetch("https://trailconnect-lq4d.onrender.com/api/pistas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaPista),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        alert("Pista registrada correctamente");
      })
      .catch((err) => {
        console.error("Error al guardar pista:", err);
        alert("Error al registrar pista");
      });
  });
}
