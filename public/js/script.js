window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');

  loader.classList.add('loader-hidden');

  // loader.addEventListener('transitionend', () => {
  //   document.body.removeChild('loader');
  // });
});

// document.addEventListener('DOMContentLoaded', () => {
//   const styleButton = document.getElementById('style-button');
//   const applyButton = document.getElementById('apply-button');
//   const networkContainer = document.getElementById('network-container');
//   const editMenu = document.getElementById('edit-menu');

//   styleButton.addEventListener('click', () => {
//     toggleDropdown();
//   });

//   applyButton.addEventListener('click', () => {
//     applyStyles();
//   });

//   networkContainer.addEventListener('contextmenu', event => {
//     event.preventDefault();
    
//     editMenu.style.display = 'block'
//     editMenu.style.left = event.x + 'px';
//     editMenu.style.top = event.y + 'px';
//   });

//   document.addEventListener('click', event => {
//     editMenu.style.display = '';
//   });
// })

// function toggleDropdown() {
//   const styleOptions = document.getElementById('style-options');
//   const arrow = document.getElementById('drop-arrow');
//   arrow.classList.toggle('rotateArrow')

//   if (styleOptions.style.display == '') {
//     styleOptions.style.display = 'block';
//   } else {
//     styleOptions.style.display = '';
//   };
// }

// function applyStyles() {
//   //
// };

