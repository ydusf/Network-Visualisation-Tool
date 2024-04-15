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
  const resetDefaultButton = document.getElementById('reset-button');
  const editMenu = document.getElementById('edit-menu');
  const selectedColour = document.getElementById('selected-colour');
  const selectedNodeSizeSlider = document.getElementById('selected-node-size-slider');
  const selectedNodeSizeNumeric = document.getElementById('selected-node-size-numeric');
  const selectedNodeLinkColour = document.getElementById('selected-node-links');
  
  var selected;
  var previousColour;
  var selectedType;

  styleButton.addEventListener('click', () => {
    toggleDropdown();
  });

  applyButton.addEventListener('click', () => {
    applyStyles();
  });

  resetDefaultButton.addEventListener('click', () => {
    document.getElementById("all-node-colour").value = "#12ffb9";
    document.getElementById("all-link-colour").value = "#ffffff";
    applyStyles();
  });

  document.addEventListener('contextmenu', event => {
    if (selected == event.target) {
      event.preventDefault();
      editMenu.style.display = 'block';
      editMenu.style.left = event.x + 'px';
      editMenu.style.top = event.y + 'px';
      selectedNodeSizeSlider.value = 5;
      selectedNodeSizeNumeric.value = 5;
    }
  });

  document.addEventListener('click', event => {
    let insideMenu = event.target.closest("#edit-menu");

    if (insideMenu === null) {
      editMenu.style.display = '';
      editMenu.style.left = 0;
      editMenu.style.top = 0;
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
    if (isNodeOrLink(selected) === "n") {
      selected.style.fill = selectedColour.value;
    } else {
      selected.style.stroke = selectedColour.value;
      previousColour = selectedColour.value;
    }
  })

  selectedColour.addEventListener('click', () => {
    if (isNodeOrLink(selected) === "n") {
      selected.style.fill = selectedColour.value;
    } else {
      selected.style.stroke = selectedColour.value;
      previousColour = selectedColour.value;
    }
  })

  selectedNodeSizeSlider.addEventListener('input', () => {
    if (isNodeOrLink(selected) === "n") {
      selected.setAttribute("r", selectedNodeSizeSlider.value);
      d3.select(selected).style("stroke-width", selectedNodeSizeSlider.value * (1/10));
      selectedNodeSizeNumeric.value = selectedNodeSizeSlider.value;
    }
  })

  selectedNodeSizeNumeric.addEventListener('input', () => {
    if (isNodeOrLink(selected) === "n") {
      selected.setAttribute("r", selectedNodeSizeNumeric.value);
      d3.select(selected).style("stroke-width", selectedNodeSizeNumeric.value * (1/10));
      selectedNodeSizeSlider.value = selectedNodeSizeNumeric.value;
    }
  })

  selectedNodeLinkColour.addEventListener('input', () => {
    if (isNodeOrLink(selected) === "n") {
      let node = d3.select(selected);
      let links = d3.selectAll("line.link").filter(function(d) {
        return d.source === node.datum() || d.target === node.datum();
      });

      links.style("stroke", selectedNodeLinkColour.value);
    }
  })
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