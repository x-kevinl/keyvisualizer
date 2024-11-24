chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectKeyboardVisualizer
  });
});

function injectKeyboardVisualizer() {
  // Check if the visualizer is already added
  if (document.getElementById("keyboard-visualizer")) return;

  // Create container for the keyboard and resizer
  const container = document.createElement("div");
  container.id = "keyboard-visualizer";
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "20%";
  container.style.backgroundColor = "#333";
  container.style.zIndex = "9999";
  container.style.overflowY = "auto";
  container.style.boxShadow = "0 -5px 15px rgba(0, 0, 0, 0.5)";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.color = "white";
  container.style.transition = "height 0.2s ease";

  // Add a resizer bar
  const resizer = document.createElement("div");
  resizer.style.position = "absolute";
  resizer.style.top = "0";
  resizer.style.left = "0";
  resizer.style.width = "100%";
  resizer.style.height = "5px";
  resizer.style.cursor = "row-resize";
  resizer.style.backgroundColor = "#444";
  container.appendChild(resizer);

  // Add keyboard rows dynamically
  const keyboardContent = document.createElement("div");
  keyboardContent.style.padding = "10px";

  const keys = [
    ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Ctrl", "Alt", " ", "Alt", "Ctrl"]
  ];

  keys.forEach(rowKeys => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "center";
    row.style.marginBottom = "5px";

    rowKeys.forEach(keyLabel => {
      const key = document.createElement("div");
      key.className = "keyboard-key";
      key.textContent = keyLabel;
      key.style.backgroundColor = "#444";
      key.style.color = "white";
      key.style.textAlign = "center";
      key.style.borderRadius = "5px";
      key.style.padding = "10px 5px";
      key.style.margin = "2px";
      key.style.width =
        keyLabel === " "
          ? "300px"
          : keyLabel === "Backspace" || keyLabel === "Enter"
          ? "100px"
          : "40px";
      key.style.height = "40px";
      key.style.display = "flex";
      key.style.justifyContent = "center";
      key.style.alignItems = "center";
      key.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
      key.setAttribute("data-key", keyLabel === " " ? "Space" : keyLabel);

      row.appendChild(key);
    });

    keyboardContent.appendChild(row);
  });

  container.appendChild(keyboardContent);
  document.body.appendChild(container);

  // Event listener for dragging resizer
  let isResizing = false;
  resizer.addEventListener("mousedown", () => (isResizing = true));
  document.addEventListener("mousemove", event => {
    if (!isResizing) return;
    const newHeight = window.innerHeight - event.clientY;
    if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
      container.style.height = newHeight + "px";
      document.body.style.marginBottom = newHeight + "px";
    }
  });
  document.addEventListener("mouseup", () => (isResizing = false));

  // Keyboard event listeners
  document.addEventListener("keydown", event => {
    const key = container.querySelector(
      `.keyboard-key[data-key="${event.key}"]`
    );
    if (key) key.style.backgroundColor = "#f39c12";
  });

  document.addEventListener("keyup", event => {
    const key = container.querySelector(
      `.keyboard-key[data-key="${event.key}"]`
    );
    if (key) key.style.backgroundColor = "#444";
  });

  // Adjust body margin
  document.body.style.marginBottom = "20%";
}
