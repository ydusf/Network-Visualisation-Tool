function createBolt(event) {
  const bolt = document.createElement("i");

  bolt.classList.add("bolt");
  bolt.classList.add("fa-solid", "fa-bolt-lightning");

  bolt.style.left = `${event.clientX}px`;
  bolt.style.top = `${event.clientY}px`;

  document.body.appendChild(bolt);

  removeElement(bolt, 75);
}
function removeElement(element, delay) {
  setTimeout(() => {
    element.remove();
  }, delay);
}
function createGlow(event) {
  const glow = document.createElement("div");

  glow.className = "glow";

  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;

  document.body.appendChild(glow);

  removeElement(glow, 75);
}

// function calcDistance(prev, curr) => {
//   const diffX = curr.x - prev.x,
//         diffY = curr.y - prev.y;

//   return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
// }

export function boltInit() {
  window.addEventListener("mousemove", (event) => {
    console.log("moving");

    createBolt(event);
    createGlow(event);
  });
}
