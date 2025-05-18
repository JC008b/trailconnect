fetch('/api/trails')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('trails');
    data.forEach(trail => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${trail.name}</strong><br>${trail.description}<br><em>${trail.difficulty}</em><hr>`;
      container.appendChild(div);
    });
  });
