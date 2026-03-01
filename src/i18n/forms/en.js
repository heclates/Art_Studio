export default {
  formTitle: 'Rezervace lekce',
  locationPlaceholder: 'Vyberte pobočku',
  categoryPlaceholder: 'Vyberte kategorii',
  directionPlaceholder: 'Vyberte obor',

  categoryChildren: 'Děti',
  categoryAdults: 'Dospělí',

  locations: [
    { slug: 'main_studio', title: 'Main Studio' },
    { slug: 'praha_2', title: 'Praha 2' },
    { slug: 'praha_9', title: 'Praha 9' }
  ],

  categories: [
    { slug: 'children', title: 'Děti' },
    { slug: 'adults', title: 'Dospělí' }
  ],

  directions: {
    children: [
      { slug: 'drawing', title: 'Malování' },
      { slug: 'ceramics', title: 'Keramika' },
      { slug: 'creative', title: 'Tvořivá dílna' },
      { slug: 'combo', title: 'Kombinované lekce' },
      { slug: 'prep_art_school', title: 'Příprava na uměleckou školu' },
      { slug: 'individual_child', title: 'Individuální lekce' },
      { slug: 'online_lessons', title: 'Online lekce' },
      { slug: 'masterclasses', title: 'Mistrovské kurzy' },
      { slug: 'plein_air', title: 'Plein air' },
      { slug: 'art_camp', title: 'Art tábor' },
      { slug: 'special_events_child', title: 'Speciální akce' },
      { slug: 'art_boxes_child', title: 'Art boxy' },
      { slug: 'gift_certificates_child', title: 'Dárkové poukazy' }
    ],
    adults: [
      { slug: 'individual_adult', title: 'Individuální lekce' },
      { slug: 'art_parties', title: 'Art večírky' },
      { slug: 'special_events_adult', title: 'Speciální akce' },
      { slug: 'art_boxes_adult', title: 'Art boxy' },
      { slug: 'gift_certificates_adult', title: 'Dárkové poukazy' }
    ]
  },

  groupDirections: [
    'Malování', 'Keramika', 'Tvořivá dílna', 'Kombinované lekce',
    'Příprava na uměleckou školu'
  ],
  childEventDirections: ['Mistrovské kurzy', 'Plein air', 'Art tábor'],

  directionLabels: {
    individual: 'Individuální lekce',
    specialEvents: 'Speciální akce',
    artBoxes: 'Art boxy',
    giftCertificates: 'Dárkové poukazy',
    onlineLessons: 'Online lekce',
    artParties: 'Art večírky'
  },

  visitTypeLabel: 'Typ návštěvy',
  trial: 'Zkušební lekce',
  existing: 'Již navštěvuji studio',

  loginPrompt: 'Pokud máte účet — přihlaste se. Pokud ne — můžete se zaregistrovat nyní.',
  loginBtn: 'Přihlásit se',
  noAccountBtn: 'Nemám účet / pokračovat bez přihlášení',
  loginAlert: 'Zde se otevře modální okno přihlášení (e-mail + heslo). Po úspěchu zobrazíme výběr dne/času.',

  fio: 'Jméno',
  parentFio: 'Jméno rodiče',
  childFio: 'Jméno dítěte',
  childBirthdate: 'Datum narození dítěte',
  phone: 'Telefon',
  email: 'E-mail',
  parentPhone: 'Telefon rodiče',
  parentEmail: 'E-mail rodiče',

  message: 'Zpráva',
  messageWishes: 'Zpráva (přání k času a formátu)',
  messageEvent: 'Zpráva (formát akce a přibližné datum)',

  day: 'Den lekce',
  time: 'Čas',

  discuss: 'Proj ednat',
  learnDates: 'Zjistit termíny / Odeslat žádost',
  discussEvent: 'Proj ednat akci',
  artBoxSubmit: 'Objednat art box',
  buyCertificate: 'Koupit poukaz',
  getAccess: 'Získat přístup',
  leaveRequest: 'Odeslat žádost',
  learnDatesShort: 'Zjistit termíny',
  createAndConfirm: 'Vytvořit účet a potvrdit rezervaci',
  trialSubmit: 'Odeslat žádost o zkušební lekci',

  artBoxVariantLabel: 'Varianta art boxu',
  artBoxMaterials: 'Art box (pouze materiály)',
  artBoxMaterialsLesson: 'Art box (materiály + lekce)',

  deliveryLabel: 'Způsob doručení',
  delivery: 'Doručení',
  pickup: 'Osobní odběr',

  totalCostPrefix: 'Celková cena: ',

  certVariantLabel: 'Varianta poukazu',
  certMasterclass: 'Poukaz na mistrovský kurz',
  certAmount: 'Poukaz na částku',
  certArtParty: 'Poukaz na art večírek',

  selectThemes: 'Vyberte téma(y):',
  accessEmail: 'E-mail pro přístup',

  pictureNumber: 'Číslo obrazu',

  submitDefault: 'Rezervovat',

  success: 'Žádost byla úspěšně odeslána!',
  error: 'Chyba při odesílání. Zkontrolujte pole.'
};
