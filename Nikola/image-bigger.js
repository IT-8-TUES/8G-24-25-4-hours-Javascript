const images = document.querySelectorAll('img'); 
// Zzimame vsichki <img> elementi ot HTML stranicata i gi skladirame v promenlivata "images"
// querySelectorAll('img') vrushta NodeList sus vsichki snimki na stranicata
// Primer: <img src="tetris.png"> shte bade vkluchena tuk

images.forEach(image => { 
  // Izpulnyavame funkciya za vseki edin ot tezi <img> elementi
  // forEach e metod, koito obhozhda vsichki snimki po red
  // "image" e tekushtata snimka v obhozhdaneto

  image.addEventListener('mouseenter', () => {
    // Dobavyame slushatel (event listener) za sybitieto "mouseenter"
    // Tozi slushatel se aktivira kogato mishkata vleze vurhu snimkata

    image.style.transform = 'scale(1.2)';
    // Promenyame stila na snimkata kato ya uvelichavame s 20%
    // scale(1.2) znachi 1.2 puti po-golyama ot normalniya razmer
    // Transformaciya se pravi chrez CSS - bez da se prezarezhda stranica
  });

  image.addEventListener('mouseleave', () => {
    // Dobavyame vtori slushatel - tozi put za "mouseleave"
    // Tozi slushatel se aktivira kogato mishkata napusne snimkata

    image.style.transform = 'scale(1)';
    // Vrushtame snimkata kum normalniya i razmer (100%)
    // scale(1) znachi originalnata golemina bez uvelichenie
  });

});
// Zatvarame forEach cikula - vsichki snimki veche imat interaktivno uvelichavane pri hover
