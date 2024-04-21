window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');

  loader.classList.add('loader-hidden');

  // loader.addEventListener('transitionend', () => {
  //   document.body.removeChild('loader');
  // });
});

document.addEventListener('DOMContentLoaded', () => {
  const styleButton = document.getElementById('style-button');
  const applyButton = document.getElementById('apply-button');
  const allDefaultButton = document.getElementById('all-reset-button');
  const editMenu = document.getElementById('edit-menu');
  const selectedColour = document.getElementById('selected-colour');
  const selectedNodeSizeSlider = document.getElementById('selected-node-size-slider');
  const selectedNodeSizeNumeric = document.getElementById('selected-node-size-numeric');
  const selectedNodeLinkColour = document.getElementById('selected-node-links');
  const selectedDefaultButton = document.getElementById('selected-reset-button');
  
  var selected;
  var previousColour;
  var selectedType;

  styleButton.addEventListener('click', () => {
    toggleDropdown();
  });

  applyButton.addEventListener('click', () => {
    applyStyles();
  });

  allDefaultButton.addEventListener('click', () => {
    document.getElementById("all-node-colour").value = "#12ffb9";
    document.getElementById("all-link-colour").value = "#ffffff";
    applyStyles();
  });

  document.addEventListener('contextmenu', event => {
    if (selected == event.target) {
      event.preventDefault();
      setDisabled(selected, selectedNodeSizeSlider, selectedNodeSizeNumeric, selectedNodeLinkColour);
      setEditMenu('block', event.x, event.y);
      selectedNodeSizeSlider.value = selected.getAttribute("r");
      selectedNodeSizeNumeric.value = selected.getAttribute("r");
    }
  });

  document.addEventListener('click', event => {
    let insideMenu = event.target.closest("#edit-menu");

    if (insideMenu === null) {
      setEditMenu();
    }

    let targetType = isNodeOrLink(event.target);

    if (targetType && selected != event.target) {
      previousColour = event.target.style.stroke;
      selectNodeOrLink(event.target, targetType);

      if (selected && selected != event.target) {
        deselect(selected, selectedType, previousColour);
      }
      
      selected = event.target;
      selectedType = targetType;
    } 
    
    else if (selected && !insideMenu) {
      deselect(selected, selectedType, previousColour);
      selected = null;
      selectedType = null;
    }
  });

  selectedColour.addEventListener('input', () => {
    let newColour = selectedColour.value;

    if (isNodeOrLink(selected) === "n") {
      selected.style.fill = newColour;
    } else {
      selected.style.stroke = newColour;
      previousColour = newColour;
    }
  })

  selectedNodeSizeSlider.addEventListener('input', () => {
    let newSize = selectedNodeSizeSlider.value;
    
    if (isNodeOrLink(selected) === "n") {
      selected.setAttribute("r", newSize);
      d3.select(selected).style("stroke-width", newSize * (1/10));
      selectedNodeSizeNumeric.value = newSize;
    }
  })

  selectedNodeSizeNumeric.addEventListener('input', () => {
    let newSize = parseFloat(selectedNodeSizeNumeric.value);
    
    if (isNodeOrLink(selected) === "n" & !isNaN(newSize) & newSize <= selectedNodeSizeNumeric.max) {
      selected.setAttribute("r", newSize);
      d3.select(selected).style("stroke-width", newSize * (1/10));
      selectedNodeSizeSlider.value = newSize;
    }
  })

  selectedNodeLinkColour.addEventListener('input', () => {
    if (isNodeOrLink(selected) === "n") {
      let node = d3.select(selected);
      let links = d3.selectAll(".link").filter(function(d) {
        return d.source === node.datum() || d.target === node.datum();
      });

      links.style("stroke", selectedNodeLinkColour.value);
    }
  })

  selectedDefaultButton.addEventListener('click', () => {
    if (isNodeOrLink(selected) === "n") {
      selectedColour.value = "#12ffb9";
      selectedNodeSizeNumeric.value = 5;
      selectedNodeLinkColour.value = "#FFFFFF";

    } else {
      selectedColour.value = "#FFFFFF";
    }

    selectedColour.dispatchEvent(new Event("input"));
    selectedNodeSizeNumeric.dispatchEvent(new Event("input"));
    selectedNodeLinkColour.dispatchEvent(new Event("input"));
  })

  function setDisabled() {
    if (isNodeOrLink(selected) === "l") {
      selectedNodeSizeSlider.setAttribute("disabled", true);
      selectedNodeSizeNumeric.setAttribute("disabled", true);
      selectedNodeLinkColour.setAttribute("disabled", true);
  
      selectedNodeSizeSlider.labels[0].style.opacity = "0.5";
      selectedNodeLinkColour.labels[0].style.opacity = "0.5";
      selectedNodeLinkColour.style.opacity = "0.5";
    } else {
      selectedNodeSizeSlider.removeAttribute("disabled");
      selectedNodeSizeNumeric.removeAttribute("disabled");
      selectedNodeLinkColour.removeAttribute("disabled");

      selectedNodeSizeSlider.labels[0].style.opacity = "1";
      selectedNodeLinkColour.labels[0].style.opacity = "1";
      selectedNodeLinkColour.style.opacity = "1";
    }
  }

  function setEditMenu(display = '', x = 0, y = 0) {
    editMenu.style.display = display;
    editMenu.style.left = x + 'px';
    editMenu.style.top = y + 'px';
  }
})

function toggleDropdown() {
  const styleOptions = document.getElementById('style-options');
  const arrow = document.getElementById('drop-arrow');
  arrow.classList.toggle('rotateArrow')

  if (styleOptions.style.display == '') {
    styleOptions.style.display = 'block';
  } else {
    styleOptions.style.display = '';
  }
}

function applyStyles() {
  nodeColour = document.getElementById("all-node-colour").value;
  linkColour = document.getElementById("all-link-colour").value;

  d3.selectAll(".node").style("fill", nodeColour);
  d3.selectAll(".link").style("stroke", linkColour);
}

function selectNodeOrLink(target, type) {
  if (type === "n") {
    target.style.stroke = "yellow";
  } else {
    target.style.stroke = "yellow";
    d3.select(target).style("stroke-opacity", 1);
  }
}

function deselect(target, type, prev) {
  if (type === "n") {
    target.style.stroke = prev;
  } else {
    target.style.stroke = prev;
    d3.select(target).style("stroke-opacity", 0.6);
  }
}

function isNodeOrLink(target) {
  const targetClasses = target.classList;

  if (targetClasses.contains('node')) {
    return "n";
  } else if (targetClasses.contains('link')) {
    return "l";
  } else {
    return null;
  }
}