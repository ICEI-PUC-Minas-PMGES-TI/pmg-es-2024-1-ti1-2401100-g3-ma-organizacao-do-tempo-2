document.addEventListener('DOMContentLoaded', function() {
  const imageList = document.getElementById('imageList');
  const uploadInput = document.getElementById('uploadInput');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');

  // Carregar imagens do localStorage
  function loadImagesFromStorage() {
      const images = JSON.parse(localStorage.getItem('images')) || [];
      images.forEach(image => addImage(image));
  }

  // Adicionar imagem à lista
  function addImage(image) {
      const imageBlock = document.createElement('div');
      imageBlock.classList.add('image-block');

      const img = document.createElement('img');
      img.src = image;

      const actions = document.createElement('div');
      actions.classList.add('actions');
      actions.innerHTML = `
          <button class="delete" onclick="deleteImage(event)"><i class="fas fa-times"></i></button>
          <button class="edit" onclick="editImage(event)"><i class="fas fa-edit"></i></button>
      `;

      imageBlock.appendChild(img);
      imageBlock.appendChild(actions);
      imageList.appendChild(imageBlock);

      // Adicionar evento de clique para abrir a imagem em tela cheia
      imageBlock.addEventListener('click', function() {
          modal.style.display = "flex";
          modalImg.src = img.src;
      });
  }

  // Evento de upload de imagem
  uploadInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function() {
          const imageUrl = reader.result;
          addImage(imageUrl);
          saveImagesToStorage(); // Salvando a imagem no localStorage após o upload
      };

      reader.readAsDataURL(file);
  });

  // Deletar imagem
  window.deleteImage = function(event) {
      const imageBlock = event.target.closest('.image-block');
      imageBlock.remove();
      saveImagesToStorage(); // Salvando a imagem no localStorage após a exclusão
      event.stopPropagation(); // Impede a propagação do evento para evitar a abertura do modal
  };

  // Editar imagem
  window.editImage = function(event) {
      const imageBlock = event.target.closest('.image-block');
      const img = imageBlock.querySelector('img');
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      fileInput.addEventListener('change', function(event) {
          const file = event.target.files[0];
          const reader = new FileReader();

          reader.onload = function() {
              const imageUrl = reader.result;
              img.src = imageUrl;
              saveImagesToStorage(); // Salvando a imagem no localStorage após a edição
          };

          reader.readAsDataURL(file);
      });

      fileInput.click();
      event.stopPropagation(); // Impede a propagação do evento para evitar a abertura do modal
  };

  // Fechar o modal ao clicar no X
  closeModal.addEventListener('click', function() {
      modal.style.display = "none";
  });

  // Fechar o modal ao clicar fora da imagem
  window.addEventListener('click', function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });

  // Salvar imagens no localStorage
  function saveImagesToStorage() {
      const images = [];
      document.querySelectorAll('.image-block img').forEach(img => {
          images.push(img.src);
      });
      localStorage.setItem('images', JSON.stringify(images));
  }

  // Carregar imagens ao carregar a página
  loadImagesFromStorage();

  // Garantir que o modal esteja fechado ao carregar a página
  modal.style.display = "none";
});

