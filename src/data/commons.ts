// Real artworks, hot-linked from Wikimedia Commons.
// Every file below is public domain or CC0 on Commons (checked 22 Nov 2026).
// To swap one, change the file name and its original pixel size (width, height).
import type { Picture } from './types'

const wm = (file: string, w: number, h: number): Picture => ({
  src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`,
  ratio: w / h,
})

export const P = {
  // Camille Claudel
  ageMur: wm("L'Âge_Mûr.jpg", 1024, 768),
  valse: wm('La_Valse.jpg', 1181, 1759),
  vague: wm('Camille_Claudel,_Vague.jpg', 5184, 3888),
  chatelaine: wm('Camille_Claudel_La_petite_châtelaine_Musée_Rodin_31102018_1.jpg', 2621, 3162),
  // Louis Comfort Tiffany
  peacockLamp: wm('Clara_Wolcott_Driscoll_(American,_1861-1944),_Tiffany_Studios_(American,_1902-1932)_-_Peacock_Table_Lamp_-_2018.281_-_Cleveland_Museum_of_Art.jpg', 2598, 3400),
  bellaWindow: wm('Bella_apartment_window_by_Louis_Comfort_Tiffany,_c._1880,_Metropolitan_Museum_of_Art.JPG', 1860, 1296),
  windowDesign: wm('Design_for_window_by_Louis_Comfort_Tiffany,_Metropolitan_Museum_of_Art.JPG', 1804, 3213),
  // Auguste Rodin
  thinker: wm('Le_Penseur_by_Rodin_(Kunsthalle_Bielefeld)_2014-04-10.JPG', 3000, 4000),
  // William Morris
  strawberryThief: wm('Strawberrythief.jpg', 736, 472),
  // Eadweard Muybridge
  horse: wm('The_Horse_in_motion._"Abe_Edgington,"_owned_by_Leland_Stanford;_driven_by_C._Marvin,_trotting_at_a_2-24_gait_over_the_Palo_Alto_track,_15th_June_1878_LOC_13624627695.jpg', 1024, 652),
  // Claude Monet
  impression: wm('Monet_-_Impression,_Sunrise.jpg', 5773, 4478),
  waterLilies: wm('Reflections_of_Clouds_on_the_Water-Lily_Pond.jpg', 3463, 1978),
  // Alfred Stieglitz
  steerage: wm('Alfred_Stieglitz_-_The_Steerage_-_Google_Art_Project.jpg', 4150, 5203),
  // Albrecht Dürer
  prayingHands: wm('Albrecht_Dürer_-_Praying_Hands,_1508_-_Google_Art_Project.jpg', 2680, 3900),
  hare: wm('Albrecht_Dürer_-_Hare,_1502_-_Google_Art_Project.jpg', 3731, 4123),
  // Georges Méliès
  moonDrawing: wm('Le_voyage_dans_la_lune_drawing.jpg', 1024, 774),
  // Henri de Toulouse-Lautrec
  laGoulue: wm('Henri_de_Toulouse-Lautrec,_Moulin_Rouge_-_La_Goulue,_1891_-_The_Metropolitan_Museum_of_Art.jpg', 2314, 3722),
  // Michelangelo
  sibyl: wm('Michelangelo_Buonarroti_-_Study_for_the_Libyan_Sibyl_-_WGA15540.jpg', 692, 900),
  // Vincent van Gogh
  starryNight: wm('Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', 44567, 35291),
  sunflowers: wm('Vincent_Willem_van_Gogh_127.jpg', 3349, 4226),
  // Leonardo da Vinci
  vitruvian: wm('Da_Vinci_Vitruve_Luc_Viatour.jpg', 2258, 3070),
  ermine: wm('Lady_with_an_Ermine_-_Leonardo_da_Vinci_(adjusted_levels).jpg', 2048, 2754),
  // Caravaggio
  calling: wm('Caravaggio_—_The_Calling_of_Saint_Matthew.jpg', 8792, 8304),
  // Johannes Vermeer
  milkmaid: wm('Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png', 9839, 11058),
  pearl: wm('1665_Girl_with_a_Pearl_Earring.jpg', 12285, 14550),
  artOfPainting: wm('Jan_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg', 6209, 7377),
  // Edgar Degas
  littleDancer: wm('The_Little_Fourteen-Year-Old_Dancer_MET_DP-14939-005.jpg', 2887, 4000),
  // Giovanni Battista Piranesi
  carceri: wm("Giovanni_Battista_Piranesi_-_Le_Carceri_d'Invenzione_-_Second_Edition_-_1761_-_01_-_Title_Plate.jpg", 1551, 2000),
  // Katsushika Hokusai
  greatWave: wm('Tsunami_by_hokusai_19th_century.jpg', 3859, 2594),
  redFuji: wm('「富嶽三十六景_凱風快晴」-South_Wind,_Clear_Sky_(Gaifū_kaisei),_also_known_as_Red_Fuji,_from_the_series_Thirty-six_Views_of_Mount_Fuji_(Fugaku_sanjūrokkei)_MET_DP141062.jpg', 3865, 2665),
  // Gustav Klimt
  kiss: wm('The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg', 7376, 7401),
  adele: wm('Gustav_Klimt,_1907,_Adele_Bloch-Bauer_I,_Neue_Galerie_New_York.jpg', 2036, 2035),
  // Sandro Botticelli
  venus: wm('Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg', 30000, 18840),
  primavera: wm('Botticelli-primavera.jpg', 4926, 3236),
  // Rembrandt
  nightWatch: wm('La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg', 14168, 11528),
  anatomy: wm('Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg', 6000, 4520),
}
