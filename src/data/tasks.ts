import type { MaturaTask, TopicMeta } from '../types/matura';

export const TOPICS: TopicMeta[] = [
  {
    id: 'planimetria',
    name: 'Planimetria',
    shortDescription: 'Pola figur płaskich, okręgi, kąty i twierdzenie cosinusów.',
  },
  {
    id: 'geometria-analityczna',
    name: 'Geometria analityczna',
    shortDescription: 'Odcinki, proste, odległość punktu od prostej i okręgi w układzie.',
  },
  {
    id: 'rownania-i-nierownosci',
    name: 'Równania i nierówności',
    shortDescription: 'Nierówności liniowe i kwadratowe oraz wzory Viète’a.',
  },
  {
    id: 'ciagi',
    name: 'Ciągi',
    shortDescription: 'Ciągi arytmetyczne, geometryczne oraz granice ciągów.',
  },
  {
    id: 'stereometria',
    name: 'Stereometria',
    shortDescription: 'Graniastosłupy, ostrosłupy, pola powierzchni i objętości brył.',
  },
  {
    id: 'trygonometria',
    name: 'Trygonometria',
    shortDescription: 'Jedynka trygonometryczna, kąty ostre i wzory na kąty podwojone.',
  },
  {
    id: 'potegi-i-pierwiastki',
    name: 'Potęgi i pierwiastki',
    shortDescription: 'Prawa działań na potęgach o wykładnikach wymiernych i ujemnych.',
  },
  {
    id: 'prawdopodobienstwo',
    name: 'Prawdopodobieństwo',
    shortDescription: 'Klasyczna definicja prawdopodobieństwa i prawdopodobieństwo warunkowe.',
  },
  {
    id: 'funkcja-kwadratowa',
    name: 'Funkcja kwadratowa',
    shortDescription: 'Postać kanoniczna, ekstrema w przedziale oraz zadania z parametrem.',
  },
  {
    id: 'funkcje',
    name: 'Funkcje',
    shortDescription: 'Dziedzina funkcji, własności i przekształcenia wykresów.',
  },
  {
    id: 'logarytmy',
    name: 'Logarytmy',
    shortDescription: 'Działania na logarytmach oraz równania logarytmiczne.',
  },
  {
    id: 'wyrazenia-algebraiczne',
    name: 'Wyrażenia algebraiczne',
    shortDescription: 'Wzory skróconego mnożenia stopnia drugiego i trzeciego.',
  },
  {
    id: 'liczby-rzeczywiste',
    name: 'Liczby rzeczywiste',
    shortDescription: 'Porównywanie liczb, działania oraz wyrażenia z pierwiastkami.',
  },
  {
    id: 'funkcja-liniowa',
    name: 'Funkcja liniowa',
    shortDescription: 'Monotoniczność, miejsca zerowe i wykres funkcji liniowej.',
  },
  {
    id: 'procenty',
    name: 'Procenty',
    shortDescription: 'Obniżki, podwyżki oraz obliczenia procentowe w zadaniach praktycznych.',
  },
  {
    id: 'statystyka',
    name: 'Statystyka',
    shortDescription: 'Średnia arytmetyczna, mediana i analiza zestawów danych.',
  },
  {
    id: 'kombinatoryka',
    name: 'Kombinatoryka',
    shortDescription: 'Reguła mnożenia, wariacje oraz permutacje z powtórzeniami.',
  },
  {
    id: 'rachunek-rozniczkowy',
    name: 'Rachunek różniczkowy',
    shortDescription: 'Pochodna funkcji, równanie stycznej i ekstrema lokalne.',
    extensionOnly: true,
  },
  {
    id: 'rownania-z-parametrem',
    name: 'Równania z parametrem',
    shortDescription: 'Liczba rozwiązań równania kwadratowego w zależności od parametru.',
    extensionOnly: true,
  },
  {
    id: 'uklady-rownan',
    name: 'Układy równań',
    shortDescription: 'Rozwiązywanie układów dwóch równań liniowych z dwiema niewiadomymi.',
  },
  {
    id: 'wartosc-bezwzgledna',
    name: 'Wartość bezwzględna',
    shortDescription: 'Równania i nierówności z wartością bezwzględną oraz interpretacja geometryczna.',
    extensionOnly: true,
  },
  {
    id: 'wielomiany',
    name: 'Wielomiany',
    shortDescription: 'Rozkład wielomianów na czynniki oraz twierdzenie Bézouta.',
  },
  {
    id: 'funkcja-wykladnicza',
    name: 'Funkcja wykładnicza',
    shortDescription: 'Wykres funkcji wykładniczej i równania wykładnicze.',
  },
  {
    id: 'optymalizacja',
    name: 'Optymalizacja',
    shortDescription: 'Wyznaczanie wartości największych i najmniejszych w geometrii i praktyce.',
  },
  {
    id: 'inne',
    name: 'Inne',
    shortDescription: 'Proporcje, stosunki liczbowe i zadania tekstowe przekrojowe.',
  },
];

/**
 * Baza zadań maturalnych (poziom podstawowy i rozszerzony) w czytelnym formacie JSON-ready.
 * Każde zadanie posiada pole level: 'podstawa' | 'rozszerzenie'.
 */
export const MATURA_TASKS: MaturaTask[] = [
  // --- ZADANIA 1-15 (oryginalne ID zachowane dla kompatybilności postępów) ---
  {
    id: 1,
    topicId: 'logarytmy',
    topicName: 'Logarytmy',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Wartość wyrażenia $\\log_2 48 - \\log_2 3$ jest równa:',
    options: [
      { key: 'A', label: '$2$' },
      { key: 'B', label: '$4$' },
      { key: 'C', label: '$8$' },
      { key: 'D', label: '$16$' },
    ],
    correctAnswer: 'B',
    hint: 'Skorzystaj ze wzoru na różnicę logarytmów o tej samej podstawie: $\\log_a b - \\log_a c = \\log_a \\frac{b}{c}$.',
    solutionSteps: [
      'Zastosuj własność różnicy logarytmów o tej samej podstawie: $$\\log_2 48 - \\log_2 3 = \\log_2 \\frac{48}{3}$$',
      'Wykonaj dzielenie w liczbie logarytmowanej: $$\\log_2 \\frac{48}{3} = \\log_2 16$$',
      'Zapisz $16$ jako potęgę liczby $2$, czyli $16 = 2^4$, skąd otrzymujemy: $$\\log_2 16 = \\log_2 2^4 = 4$$',
      'Poprawna odpowiedź to **B ($4$)**.',
    ],
  },
  {
    id: 2,
    topicId: 'procenty',
    topicName: 'Procenty',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Cena pewnego roweru po obniżce o $20\\%$ wynosi $1600\\text{ zł}$. Ile kosztował ten rower przed obniżką?',
    options: [
      { key: 'A', label: '$1920\\text{ zł}$' },
      { key: 'B', label: '$1960\\text{ zł}$' },
      { key: 'C', label: '$2000\\text{ zł}$' },
      { key: 'D', label: '$2200\\text{ zł}$' },
    ],
    correctAnswer: 'C',
    hint: 'Oznacz cenę przed obniżką jako $x$. Po obniżce o $20\\%$ cena stanowi $80\\%$ wartości początkowej.',
    solutionSteps: [
      'Niech $x$ oznacza cenę roweru przed obniżką.',
      'Po obniżce o $20\\%$ płacimy $100\\% - 20\\% = 80\\% = 0{,}8$ ceny początkowej: $$0{,}8 \\cdot x = 1600$$',
      'Dzielimy obie strony równania przez $0{,}8$: $$x = \\frac{1600}{0{,}8} = 2000$$',
      'Rower przed obniżką kosztował $2000\\text{ zł}$, czyli poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 3,
    topicId: 'potegi-i-pierwiastki',
    topicName: 'Potęgi i pierwiastki',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'Oblicz wartość wyrażenia $\\frac{27^2 \\cdot 9^{-1}}{3^3}$. Wynik zapisz w postaci liczby całkowitej.',
    correctAnswer: '3',
    acceptedAnswers: ['3', '3.0'],
    hint: 'Zamień liczby $27$ i $9$ na potęgi liczby $3$, a następnie zastosuj prawa działań na potęgach.',
    solutionSteps: [
      'Zapisz wszystkie liczby jako potęgi o podstawie $3$: $27 = 3^3$ oraz $9 = 3^2$.',
      'Podstaw do licznika: $$27^2 \\cdot 9^{-1} = (3^3)^2 \\cdot (3^2)^{-1} = 3^6 \\cdot 3^{-2} = 3^4$$',
      'Podziel licznik przez mianownik: $$\\frac{3^4}{3^3} = 3^{4 - 3} = 3$$',
      'Ostateczny wynik to **$3$**.',
    ],
  },
  {
    id: 4,
    topicId: 'funkcja-liniowa',
    topicName: 'Funkcja liniowa',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Funkcja liniowa $f(x) = (2m - 6)x + 5$ jest malejąca dla wszystkich liczb rzeczywistych $m$ spełniających warunek:',
    options: [
      { key: 'A', label: '$m < 3$' },
      { key: 'B', label: '$m > 3$' },
      { key: 'C', label: '$m \\le 3$' },
      { key: 'D', label: '$m < -3$' },
    ],
    correctAnswer: 'A',
    hint: 'Funkcja liniowa $f(x) = ax + b$ jest malejąca wtedy i tylko wtedy, gdy jej współczynnik kierunkowy $a$ jest ujemny.',
    solutionSteps: [
      'Współczynnik kierunkowy podanej funkcji wynosi $a = 2m - 6$.',
      'Warunek funkcji malejącej to $a < 0$: $$2m - 6 < 0$$',
      'Rozwiązujemy nierówność: $$2m < 6 \\implies m < 3$$',
      'Poprawna odpowiedź to **A ($m < 3$)**.',
    ],
  },
  {
    id: 5,
    topicId: 'funkcja-kwadratowa',
    topicName: 'Funkcja kwadratowa',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Wierzchołek paraboli będącej wykresem funkcji kwadratowej $f(x) = 2(x - 3)^2 - 8$ ma współrzędne:',
    options: [
      { key: 'A', label: '$(-3, -8)$' },
      { key: 'B', label: '$(3, 8)$' },
      { key: 'C', label: '$(3, -8)$' },
      { key: 'D', label: '$(-3, 8)$' },
    ],
    correctAnswer: 'C',
    hint: 'Porównaj wzór funkcji z postacią kanoniczną $f(x) = a(x - p)^2 + q$, gdzie wierzchołek to $W = (p, q)$.',
    solutionSteps: [
      'Postać kanoniczna funkcji kwadratowej ma wzór $f(x) = a(x - p)^2 + q$.',
      'Dla $f(x) = 2(x - 3)^2 - 8$ odczytujemy $p = 3$ oraz $q = -8$.',
      'Współrzędne wierzchołka wynoszą $W = (3, -8)$, czyli poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 6,
    topicId: 'funkcja-kwadratowa',
    topicName: 'Funkcja kwadratowa',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'Wyznacz największą wartość funkcji kwadratowej $f(x) = -x^2 + 4x + 5$ w przedziale domkniętym $\\langle 0, 5 \\rangle$.',
    correctAnswer: '9',
    acceptedAnswers: ['9', '9.0'],
    hint: 'Oblicz pierwszą współrzędną wierzchołka paraboli $p = -\\frac{b}{2a}$ i sprawdź, czy należy ona do przedziału $\\langle 0, 5 \\rangle$.',
    solutionSteps: [
      'Współczynniki: $a = -1 < 0$, $b = 4$, $c = 5$. Ramiona paraboli są skierowane w dół.',
      'Pierwsza współrzędna wierzchołka: $$p = -\\frac{4}{2 \\cdot (-1)} = 2$$',
      'Ponieważ $2 \\in \\langle 0, 5 \\rangle$, maksimum przyjmowane jest w wierzchołku: $$f(2) = -2^2 + 4 \\cdot 2 + 5 = 9$$',
      'Na krańcach przedziału: $f(0) = 5$ oraz $f(5) = 0$. Największa wartość to **$9$**.',
    ],
  },
  {
    id: 7,
    topicId: 'ciagi',
    topicName: 'Ciągi',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'W ciągu arytmetycznym $(a_n)$, określonym dla $n \\ge 1$, dane są wyrazy: $a_1 = 5$ oraz $a_4 = 17$. Różnica $r$ tego ciągu jest równa:',
    options: [
      { key: 'A', label: '$3$' },
      { key: 'B', label: '$4$' },
      { key: 'C', label: '$5$' },
      { key: 'D', label: '$6$' },
    ],
    correctAnswer: 'B',
    hint: 'Zastosuj wzór na $n$-ty wyraz ciągu arytmetycznego: $a_n = a_1 + (n - 1)r$ dla $n = 4$.',
    solutionSteps: [
      'Dla $n = 4$ mamy $a_4 = a_1 + 3r$.',
      'Podstawiamy dane: $$17 = 5 + 3r \\implies 3r = 12 \\implies r = 4$$',
      'Poprawna odpowiedź to **B ($4$)**.',
    ],
  },
  {
    id: 8,
    topicId: 'ciagi',
    topicName: 'Ciągi',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Trzywyrazowy ciąg $(2, x, 18)$ jest geometryczny i wszystkie jego wyrazy są dodatnie. Wówczas liczba $x$ jest równa:',
    options: [
      { key: 'A', label: '$6$' },
      { key: 'B', label: '$9$' },
      { key: 'C', label: '$10$' },
      { key: 'D', label: '$36$' },
    ],
    correctAnswer: 'A',
    hint: 'Dla trzech kolejnych wyrazów ciągu geometrycznego $(a, b, c)$ zachodzi własność $b^2 = a \\cdot c$.',
    solutionSteps: [
      'Z własności ciągu geometrycznego: $$x^2 = 2 \\cdot 18 = 36$$',
      'Ponieważ wyrazy ciągu są dodatnie, otrzymujemy $x = 6$.',
      'Poprawna odpowiedź to **A ($6$)**.',
    ],
  },
  {
    id: 9,
    topicId: 'ciagi',
    topicName: 'Ciągi',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'Dany jest ciąg $(a_n)$ określony wzorem $a_n = \\frac{n^2 - 9}{n + 2}$ dla każdej liczby naturalnej $n \\ge 1$. Który wyraz tego ciągu jest równy $0$? Podaj numer $n$ tego wyrazu.',
    correctAnswer: '3',
    acceptedAnswers: ['3'],
    hint: 'Ułamek jest równy $0$ wtedy i tylko wtedy, gdy jego licznik jest równy $0$ (mianownik $n + 2$ dla $n \\ge 1$ jest zawsze dodatni).',
    solutionSteps: [
      'Przyrównujemy wyraz ogólny do zera: $$\\frac{n^2 - 9}{n + 2} = 0$$',
      'Ponieważ $n + 2 \\ge 3 > 0$, przyrównujemy licznik do zera: $$n^2 - 9 = 0 \\implies n = 3 \\quad \\text{lub} \\quad n = -3$$',
      'Z warunku $n \\ge 1$ otrzymujemy **$n = 3$**.',
    ],
  },
  {
    id: 10,
    topicId: 'trygonometria',
    topicName: 'Trygonometria',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Kąt $\\alpha$ jest ostry oraz $\\sin \\alpha = \\frac{3}{5}$. Wówczas $\\cos \\alpha$ jest równy:',
    options: [
      { key: 'A', label: '$\\frac{2}{5}$' },
      { key: 'B', label: '$\\frac{3}{4}$' },
      { key: 'C', label: '$\\frac{4}{5}$' },
      { key: 'D', label: '$\\frac{5}{4}$' },
    ],
    correctAnswer: 'C',
    hint: 'Zastosuj jedynkę trygonometryczną $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$ oraz pamiętaj, że cosinus kąta ostrego jest dodatni.',
    solutionSteps: [
      'Z jedynki trygonometrycznej: $$\\left(\\frac{3}{5}\\right)^2 + \\cos^2 \\alpha = 1 \\implies \\cos^2 \\alpha = 1 - \\frac{9}{25} = \\frac{16}{25}$$',
      'Ponieważ kąt $\\alpha$ jest ostry ($\\cos \\alpha > 0$), to $\\cos \\alpha = \\frac{4}{5}$.',
      'Poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 11,
    topicId: 'trygonometria',
    topicName: 'Trygonometria',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Wartość wyrażenia $\\sin 30^\\circ + \\cos 60^\\circ + \\operatorname{tg} 45^\\circ$ jest równa:',
    options: [
      { key: 'A', label: '$1$' },
      { key: 'B', label: '$\\frac{3}{2}$' },
      { key: 'C', label: '$2$' },
      { key: 'D', label: '$1 + \\sqrt{3}$' },
    ],
    correctAnswer: 'C',
    hint: 'Odczytaj dokładne wartości dla kątów $30^\\circ$, $60^\\circ$ i $45^\\circ$ z tablic maturalnych.',
    solutionSteps: [
      'Podstawiamy wartości: $$\\sin 30^\\circ = \\frac{1}{2}, \\quad \\cos 60^\\circ = \\frac{1}{2}, \\quad \\operatorname{tg} 45^\\circ = 1$$',
      'Sumujemy: $$\\frac{1}{2} + \\frac{1}{2} + 1 = 2$$',
      'Poprawna odpowiedź to **C ($2$)**.',
    ],
  },
  {
    id: 12,
    topicId: 'trygonometria',
    topicName: 'Trygonometria',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'Kąt $\\alpha$ jest ostry oraz $\\operatorname{tg} \\alpha = 2$. Oblicz wartość wyrażenia $\\frac{3\\sin \\alpha + \\cos \\alpha}{\\sin \\alpha + 2\\cos \\alpha}$. Wynik zapisz w postaci ułamka dziesiętnego.',
    correctAnswer: '1.75',
    acceptedAnswers: ['1.75', '7/4'],
    hint: 'Podziel licznik i mianownik ułamka przez $\\cos \\alpha$ (dla kąta ostrego $\\cos \\alpha \\neq 0$).',
    solutionSteps: [
      'Dzielimy licznik i mianownik przez $\\cos \\alpha \\neq 0$: $$\\frac{3\\operatorname{tg} \\alpha + 1}{\\operatorname{tg} \\alpha + 2}$$',
      'Podstawiamy $\\operatorname{tg} \\alpha = 2$: $$\\frac{3 \\cdot 2 + 1}{2 + 2} = \\frac{7}{4} = 1{,}75$$',
      'Ostateczny wynik to **$1{,}75$**.',
    ],
  },
  {
    id: 13,
    topicId: 'planimetria',
    topicName: 'Planimetria',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Pole trójkąta równobocznego o boku długości $a = 4\\sqrt{3}$ jest równe:',
    options: [
      { key: 'A', label: '$6\\sqrt{3}$' },
      { key: 'B', label: '$12\\sqrt{3}$' },
      { key: 'C', label: '$16\\sqrt{3}$' },
      { key: 'D', label: '$48\\sqrt{3}$' },
    ],
    correctAnswer: 'B',
    hint: 'Skorzystaj ze wzoru na pole trójkąta równobocznego: $P = \\frac{a^2\\sqrt{3}}{4}$.',
    solutionSteps: [
      'Podstawiamy $a = 4\\sqrt{3}$: $$P = \\frac{(4\\sqrt{3})^2 \\sqrt{3}}{4} = \\frac{48\\sqrt{3}}{4} = 12\\sqrt{3}$$',
      'Poprawna odpowiedź to **B ($12\\sqrt{3}$)**.',
    ],
  },
  {
    id: 14,
    topicId: 'planimetria',
    topicName: 'Planimetria',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Kąt środkowy oparty na tym samym łuku okręgu co kąt wpisany o mierze $38^\\circ$ ma miarę:',
    options: [
      { key: 'A', label: '$19^\\circ$' },
      { key: 'B', label: '$38^\\circ$' },
      { key: 'C', label: '$76^\\circ$' },
      { key: 'D', label: '$142^\\circ$' },
    ],
    correctAnswer: 'C',
    hint: 'Kąt środkowy oparty na tym samym łuku okręgu jest dwa razy większy od kąta wpisanego.',
    solutionSteps: [
      'Kąt środkowy $\\beta = 2 \\cdot 38^\\circ = 76^\\circ$.',
      'Poprawna odpowiedź to **C ($76^\\circ$)**.',
    ],
  },
  {
    id: 15,
    topicId: 'planimetria',
    topicName: 'Planimetria',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'W trapezie równoramiennym podstawy mają długości $6$ i $14$, a ramię ma długość $5$. Oblicz pole tego trapezu.',
    correctAnswer: '30',
    acceptedAnswers: ['30', '30.0'],
    hint: 'Poprowadź wysokości z obu końców krótszej podstawy i wyznacz wysokość trapezu z twierdzenia Pitagorasa.',
    solutionSteps: [
      'Długość odcinka przy dłuższej podstawie: $$x = \\frac{14 - 6}{2} = 4$$',
      'Z twierdzenia Pitagorasa: $$h^2 + 4^2 = 5^2 \\implies h = 3$$',
      'Pole trapezu: $$P = \\frac{14 + 6}{2} \\cdot 3 = 30$$',
      'Pole trapezu wynosi **$30$**.',
    ],
  },

  // --- NOWE ZADANIA DLA PEŁNYCH 25 DZIAŁÓW (Podstawa + Rozszerzenie) ---

  // 1. Planimetria (Rozszerzenie)
  {
    id: 16,
    topicId: 'planimetria',
    topicName: 'Planimetria',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'W trójkącie $ABC$ boki mają długości $|AB| = 5$ oraz $|AC| = 8$, a kąt $\\sphericalangle BAC$ ma miarę $60^\\circ$. Oblicz długość boku $BC$.',
    correctAnswer: '7',
    acceptedAnswers: ['7'],
    hint: 'Zastosuj twierdzenie cosinusów dla boku $BC$ leżącego naprzeciw kąta $60^\\circ$.',
    solutionSteps: [
      'Z twierdzenia cosinusów: $$|BC|^2 = |AB|^2 + |AC|^2 - 2 \\cdot |AB| \\cdot |AC| \\cdot \\cos 60^\\circ$$',
      'Podstawiamy dane ($\\cos 60^\\circ = \\frac{1}{2}$): $$|BC|^2 = 5^2 + 8^2 - 2 \\cdot 5 \\cdot 8 \\cdot \\frac{1}{2} = 25 + 64 - 40 = 49$$',
      'Stąd $|BC| = \\sqrt{49} = 7$.',
      'Długość boku $BC$ wynosi **$7$**.',
    ],
  },

  // 2. Geometria analityczna (Podstawa + Rozszerzenie)
  {
    id: 17,
    topicId: 'geometria-analityczna',
    topicName: 'Geometria analityczna',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Środkiem odcinka $AB$, gdzie $A = (-2, 5)$ i $B = (6, -1)$, jest punkt $S$ o współrzędnych:',
    options: [
      { key: 'A', label: '$(4, 3)$' },
      { key: 'B', label: '$(2, 2)$' },
      { key: 'C', label: '$(2, 3)$' },
      { key: 'D', label: '$(-4, 2)$' },
    ],
    correctAnswer: 'B',
    hint: 'Współrzędne środka odcinka to średnie arytmetyczne odpowiednich współrzędnych jego końców.',
    solutionSteps: [
      'Obliczamy współrzędne środka $S$: $$x_S = \\frac{-2 + 6}{2} = 2, \\quad y_S = \\frac{5 + (-1)}{2} = 2$$',
      'Stąd $S = (2, 2)$. Poprawna odpowiedź to **B**.',
    ],
  },
  {
    id: 18,
    topicId: 'geometria-analityczna',
    topicName: 'Geometria analityczna',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Oblicz odległość punktu $P = (2, 3)$ od prostej $k$ opisanej równaniem ogólnym $3x - 4y + 16 = 0$.',
    correctAnswer: '2',
    acceptedAnswers: ['2'],
    hint: 'Skorzystaj ze wzoru na odległość punktu $P=(x_0, y_0)$ od prostej $Ax + By + C = 0$: $d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$.',
    solutionSteps: [
      'Podstawiamy $A = 3$, $B = -4$, $C = 16$ oraz $x_0 = 2$, $y_0 = 3$: $$d = \\frac{|3 \\cdot 2 - 4 \\cdot 3 + 16|}{\\sqrt{3^2 + (-4)^2}}$$',
      'Obliczamy licznik i mianownik: $$d = \\frac{|6 - 12 + 16|}{\\sqrt{9 + 16}} = \\frac{10}{5} = 2$$',
      'Szukana odległość wynosi **$2$**.',
    ],
  },

  // 3. Równania i nierówności (Podstawa + Rozszerzenie)
  {
    id: 19,
    topicId: 'rownania-i-nierownosci',
    topicName: 'Równania i nierówności',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Największą liczbą całkowitą spełniającą nierówność $3x - 7 < 8$ jest:',
    options: [
      { key: 'A', label: '$3$' },
      { key: 'B', label: '$4$' },
      { key: 'C', label: '$5$' },
      { key: 'D', label: '$6$' },
    ],
    correctAnswer: 'B',
    hint: 'Rozwiąż nierówność liniową, przenosząc $-7$ na prawą stronę, i uważaj na znak nierówności ostrej $<$.',
    solutionSteps: [
      'Rozwiązujemy nierówność: $$3x - 7 < 8 \\implies 3x < 15 \\implies x < 5$$',
      'Największą liczbą całkowitą ostro mniejszą od $5$ jest $4$.',
      'Poprawna odpowiedź to **B ($4$)**.',
    ],
  },
  {
    id: 20,
    topicId: 'rownania-i-nierownosci',
    topicName: 'Równania i nierówności',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Dane jest równanie kwadratowe $x^2 - 6x + 4 = 0$ o pierwiastkach $x_1$ i $x_2$. Oblicz wartość wyrażenia $x_1^2 + x_2^2$.',
    correctAnswer: '28',
    acceptedAnswers: ['28'],
    hint: 'Przekształć wyrażenie $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$ i zastosuj wzory Viète’a.',
    solutionSteps: [
      'Sprawdzamy wyróżnik: $\\Delta = (-6)^2 - 4 \\cdot 1 \\cdot 4 = 36 - 16 = 20 > 0$, więc równanie ma dwa różne pierwiastki.',
      'Ze wzorów Viète’a: $x_1 + x_2 = 6$ oraz $x_1 x_2 = 4$.',
      'Obliczamy sumę kwadratów: $$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2 = 6^2 - 2 \\cdot 4 = 36 - 8 = 28$$',
      'Ostateczny wynik to **$28$**.',
    ],
  },

  // 4. Ciągi (Rozszerzenie)
  {
    id: 21,
    topicId: 'ciagi',
    topicName: 'Ciągi',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Oblicz granicę ciągu $\\lim_{n \\to \\infty} \\frac{6n^2 - 3n + 1}{2n^2 + 5n - 4}$.',
    correctAnswer: '3',
    acceptedAnswers: ['3'],
    hint: 'Podziel licznik i mianownik przez najwyższą potęgę zmiennej $n$ występującą w mianowniku, czyli $n^2$.',
    solutionSteps: [
      'Dzielimy licznik i mianownik przez $n^2$: $$\\lim_{n \\to \\infty} \\frac{6 - \\frac{3}{n} + \\frac{1}{n^2}}{2 + \\frac{5}{n} - \\frac{4}{n^2}}$$',
      'Ponieważ $\\frac{1}{n} \\to 0$ oraz $\\frac{1}{n^2} \\to 0$ przy $n \\to \\infty$, otrzymujemy: $$\\frac{6 - 0 + 0}{2 + 0 - 0} = \\frac{6}{2} = 3$$',
      'Granica wynosi **$3$**.',
    ],
  },

  // 5. Stereometria (Podstawa + Rozszerzenie)
  {
    id: 22,
    topicId: 'stereometria',
    topicName: 'Stereometria',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Pole powierzchni całkowitej sześcianu o krawędzi długości $a = 4$ jest równe:',
    options: [
      { key: 'A', label: '$16$' },
      { key: 'B', label: '$64$' },
      { key: 'C', label: '$96$' },
      { key: 'D', label: '$128$' },
    ],
    correctAnswer: 'C',
    hint: 'Sześcian składa się z $6$ przystających ścian będących kwadratami o boku $a$.',
    solutionSteps: [
      'Pole całkowite sześcianu wynosi $P_c = 6a^2$.',
      'Podstawiamy $a = 4$: $$P_c = 6 \\cdot 4^2 = 6 \\cdot 16 = 96$$',
      'Poprawna odpowiedź to **C ($96$)**.',
    ],
  },
  {
    id: 23,
    topicId: 'stereometria',
    topicName: 'Stereometria',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'W ostrosłupie prawidłowym czworokątnym krawędź podstawy ma długość $a = 6$, a wysokość ostrosłupa wynosi $H = 4$. Oblicz pole powierzchni bocznej tego ostrosłupa.',
    correctAnswer: '60',
    acceptedAnswers: ['60'],
    hint: 'Wyznacz wysokość ściany bocznej $h_b$ z trójkąta prostokątnego o przyprostokątnych $H$ oraz $\\frac{a}{2}$.',
    solutionSteps: [
      'Połowa krawędzi podstawy wynosi $r = \\frac{6}{2} = 3$.',
      'Z twierdzenia Pitagorasa obliczamy wysokość ściany bocznej $h_b$: $$h_b = \\sqrt{H^2 + r^2} = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5$$',
      'Pole jednej ściany bocznej: $P_1 = \\frac{1}{2} \\cdot 6 \\cdot 5 = 15$.',
      'Pole powierzchni bocznej (4 ściany): $$P_b = 4 \\cdot 15 = 60$$',
      'Ostateczny wynik to **$60$**.',
    ],
  },

  // 6. Trygonometria (Rozszerzenie)
  {
    id: 24,
    topicId: 'trygonometria',
    topicName: 'Trygonometria',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Kąt $\\alpha$ jest ostry oraz $\\cos \\alpha = \\frac{3}{5}$. Oblicz wartość $\\sin 2\\alpha$. Wynik zapisz w postaci ułamka dziesiętnego.',
    correctAnswer: '0.96',
    acceptedAnswers: ['0.96', '24/25'],
    hint: 'Wykorzystaj jedynkę trygonometryczną do wyznaczenia $\\sin \\alpha$, a następnie wzór na sinus kąta podwojonego: $\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha$.',
    solutionSteps: [
      'Z jedynki trygonometrycznej dla kąta ostrego: $$\\sin \\alpha = \\sqrt{1 - \\left(\\frac{3}{5}\\right)^2} = \\sqrt{\\frac{16}{25}} = \\frac{4}{5}$$',
      'Stosujemy wzór na sinus kąta podwojonego: $$\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha = 2 \\cdot \\frac{4}{5} \\cdot \\frac{3}{5} = \\frac{24}{25} = 0{,}96$$',
      'Ostateczny wynik to **$0{,}96$**.',
    ],
  },

  // 7. Potęgi i pierwiastki (Podstawa + Rozszerzenie)
  {
    id: 25,
    topicId: 'potegi-i-pierwiastki',
    topicName: 'Potęgi i pierwiastki',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Wartość wyrażenia $(\\sqrt{5} - 2)(\\sqrt{5} + 2)$ jest równa:',
    options: [
      { key: 'A', label: '$1$' },
      { key: 'B', label: '$3$' },
      { key: 'C', label: '$9$' },
      { key: 'D', label: '$5 - 2\\sqrt{5}$' },
    ],
    correctAnswer: 'A',
    hint: 'Zastosuj wzór skróconego mnożenia na różnicę kwadratów: $(a - b)(a + b) = a^2 - b^2$.',
    solutionSteps: [
      'Ze wzoru na różnicę kwadratów: $$(\\sqrt{5} - 2)(\\sqrt{5} + 2) = (\\sqrt{5})^2 - 2^2 = 5 - 4 = 1$$',
      'Poprawna odpowiedź to **A ($1$)**.',
    ],
  },
  {
    id: 26,
    topicId: 'potegi-i-pierwiastki',
    topicName: 'Potęgi i pierwiastki',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Oblicz wartość wyrażenia $\\left(8^{\\frac{2}{3}} + 16^{-\\frac{1}{2}}\\right) \\cdot 4$.',
    correctAnswer: '17',
    acceptedAnswers: ['17'],
    hint: 'Zamień potęgi o wykładnikach wymiernych na pierwiastki: $8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2$ oraz $16^{-\\frac{1}{2}} = \\frac{1}{\\sqrt{16}}$.',
    solutionSteps: [
      'Obliczamy poszczególne składniki: $$8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4$$',
      '$$16^{-\\frac{1}{2}} = \\frac{1}{\\sqrt{16}} = \\frac{1}{4}$$',
      'Mnożymy sumę przez $4$: $$\\left(4 + \\frac{1}{4}\\right) \\cdot 4 = 16 + 1 = 17$$',
      'Ostateczny wynik to **$17$**.',
    ],
  },

  // 8. Prawdopodobieństwo (Podstawa + Rozszerzenie)
  {
    id: 27,
    topicId: 'prawdopodobienstwo',
    topicName: 'Prawdopodobieństwo',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Rzucamy raz symetryczną sześcienną kostką do gry. Prawdopodobieństwo wyrzucenia liczby oczek większej od $4$ wynosi:',
    options: [
      { key: 'A', label: '$\\frac{1}{6}$' },
      { key: 'B', label: '$\\frac{1}{3}$' },
      { key: 'C', label: '$\\frac{1}{2}$' },
      { key: 'D', label: '$\\frac{2}{3}$' },
    ],
    correctAnswer: 'B',
    hint: 'Wypisz wszystkie wyniki sprzyjające (większe od $4$) spośród $\\{1, 2, 3, 4, 5, 6\\}$.',
    solutionSteps: [
      'Liczba wszystkich zdarzeń elementarnych: $|\\Omega| = 6$.',
      'Zdarzenia sprzyjające ($> 4$): $A = \\{5, 6\\}$, więc $|A| = 2$.',
      'Prawdopodobieństwo: $$P(A) = \\frac{2}{6} = \\frac{1}{3}$$',
      'Poprawna odpowiedź to **B**.',
    ],
  },
  {
    id: 28,
    topicId: 'prawdopodobienstwo',
    topicName: 'Prawdopodobieństwo',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Zdarzenia losowe $A$ i $B$ są zawarte w przestrzeni $\\Omega$ oraz $P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(A \\cup B) = 0{,}7$. Oblicz prawdopodobieństwo warunkowe $P(A \\mid B)$. Wynik zapisz w postaci ułamka dziesiętnego.',
    correctAnswer: '0.5',
    acceptedAnswers: ['0.5', '1/2'],
    hint: 'Wyznacz $P(A \\cap B)$ ze wzoru $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, a następnie użyj definicji $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$.',
    solutionSteps: [
      'Ze wzoru na sumę zdarzeń: $$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0{,}5 + 0{,}4 - 0{,}7 = 0{,}2$$',
      'Z definicji prawdopodobieństwa warunkowego: $$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0{,}2}{0{,}4} = 0{,}5$$',
      'Ostateczny wynik to **$0{,}5$**.',
    ],
  },

  // 9. Funkcja kwadratowa (Rozszerzenie)
  {
    id: 29,
    topicId: 'funkcja-kwadratowa',
    topicName: 'Funkcja kwadratowa',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Dla funkcji kwadratowej $f(x) = x^2 - (m + 1)x + m$ wyznacz dodatnią wartość parametru $m$, dla której suma kwadratów miejsc zerowych tej funkcji jest równa $10$.',
    correctAnswer: '3',
    acceptedAnswers: ['3'],
    hint: 'Zastosuj wzory Viète’a: $x_1 + x_2 = m + 1$ oraz $x_1 x_2 = m$, i podstaw do $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$.',
    solutionSteps: [
      'Ze wzorów Viète’a: $x_1 + x_2 = m + 1$, $x_1 x_2 = m$.',
      'Zapisujemy równanie na sumę kwadratów miejsc zerowych: $$(m + 1)^2 - 2m = 10 \\implies m^2 + 2m + 1 - 2m = 10 \\implies m^2 = 9$$',
      'Ponieważ $m > 0$, otrzymujemy $m = 3$. (Dla $m = 3$: $\\Delta = 16 - 12 = 4 > 0$, więc miejsca zerowe istnieją).',
      'Szukana wartość parametru to **$3$**.',
    ],
  },

  // 10. Funkcje (Podstawa + Rozszerzenie)
  {
    id: 30,
    topicId: 'funkcje',
    topicName: 'Funkcje',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Dziedziną funkcji określonej wzorem $f(x) = \\frac{x + 2}{x - 5}$ jest zbiór:',
    options: [
      { key: 'A', label: '$\\mathbb{R} \\setminus \\{-2\\}$' },
      { key: 'B', label: '$\\mathbb{R} \\setminus \\{5\\}$' },
      { key: 'C', label: '$\\mathbb{R} \\setminus \\{-2, 5\\}$' },
      { key: 'D', label: '$\\mathbb{R}$' },
    ],
    correctAnswer: 'B',
    hint: 'Mianownik ułamka nie może być równy zero.',
    solutionSteps: [
      'Wyznaczamy warunek dla mianownika: $x - 5 \\neq 0 \\implies x \\neq 5$.',
      'Dziedziną jest zbiór $\\mathbb{R} \\setminus \\{5\\}$, czyli odpowiedź **B**.',
    ],
  },
  {
    id: 31,
    topicId: 'funkcje',
    topicName: 'Funkcje',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Punkt $A = (1, 4)$ należy do wykresu funkcji $f$. Funkcja $g$ jest określona wzorem $g(x) = f(x - 2) + 3$. Oblicz sumę współrzędnych obrazu punktu $A$ na wykresie funkcji $g$.',
    correctAnswer: '10',
    acceptedAnswers: ['10'],
    hint: 'Wykres funkcji $g(x) = f(x - p) + q$ powstaje przez przesunięcie wykresu funkcji $f$ o wektor $\\vec{u} = [p, q]$.',
    solutionSteps: [
      'Przekształcenie $g(x) = f(x - 2) + 3$ odpowiada przesunięciu wykresu o wektor $\\vec{u} = [2, 3]$.',
      'Obrazem punktu $A = (1, 4)$ jest punkt $A\' = (1 + 2, 4 + 3) = (3, 7)$.',
      'Suma współrzędnych punktu $A\'$: $$3 + 7 = 10$$',
      'Ostateczny wynik to **$10$**.',
    ],
  },

  // 11. Logarytmy (Rozszerzenie)
  {
    id: 32,
    topicId: 'logarytmy',
    topicName: 'Logarytmy',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question: 'Rozwiąż równanie $\\log_3(x + 2) + \\log_3(x - 4) = 3$. Podaj wartość $x$.',
    correctAnswer: '7',
    acceptedAnswers: ['7'],
    hint: 'Najpierw wyznacz dziedzinę ($x + 2 > 0$ i $x - 4 > 0$), a następnie zamień sumę logarytmów na logarytm iloczynu.',
    solutionSteps: [
      'Dziedzina równania: $x > -2$ i $x > 4$, czyli $x > 4$.',
      'Łączymy logarytmy: $$\\log_3((x + 2)(x - 4)) = 3 \\implies (x + 2)(x - 4) = 3^3$$',
      'Rozwiązujemy równanie kwadratowe: $$x^2 - 2x - 8 = 27 \\implies x^2 - 2x - 35 = 0 \\implies (x - 7)(x + 5) = 0$$',
      'Ponieważ $x > 4$, jedynym rozwiązaniem jest **$x = 7$**.',
    ],
  },

  // 12. Wyrażenia algebraiczne (Podstawa + Rozszerzenie)
  {
    id: 33,
    topicId: 'wyrazenia-algebraiczne',
    topicName: 'Wyrażenia algebraiczne',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Dla każdej liczby rzeczywistej $x$ wyrażenie $(2x - 3)^2 - 4x^2$ jest równe:',
    options: [
      { key: 'A', label: '$-12x + 9$' },
      { key: 'B', label: '$9 - 6x$' },
      { key: 'C', label: '$-12x - 9$' },
      { key: 'D', label: '$8x^2 - 12x + 9$' },
    ],
    correctAnswer: 'A',
    hint: 'Rozwiń nawias ze wzoru $(a - b)^2 = a^2 - 2ab + b^2$ i zredukuj wyrazy podobne.',
    solutionSteps: [
      'Rozwijamy kwadrat różnicy: $$(2x - 3)^2 - 4x^2 = 4x^2 - 12x + 9 - 4x^2 = -12x + 9$$',
      'Poprawna odpowiedź to **A**.',
    ],
  },
  {
    id: 34,
    topicId: 'wyrazenia-algebraiczne',
    topicName: 'Wyrażenia algebraiczne',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Liczby rzeczywiste $a$ i $b$ spełniają warunki $a + b = 7$ oraz $a \\cdot b = 10$. Oblicz wartość wyrażenia $a^3 + b^3$.',
    correctAnswer: '133',
    acceptedAnswers: ['133'],
    hint: 'Wykorzystaj tożsamość $a^3 + b^3 = (a + b)^3 - 3ab(a + b)$ lub $a^3 + b^3 = (a + b)((a + b)^2 - 3ab)$.',
    solutionSteps: [
      'Korzystamy ze wzoru: $$a^3 + b^3 = (a + b)^3 - 3ab(a + b)$$',
      'Podstawiamy $a + b = 7$ oraz $ab = 10$: $$a^3 + b^3 = 7^3 - 3 \\cdot 10 \\cdot 7 = 343 - 210 = 133$$',
      'Ostateczny wynik to **$133$**.',
    ],
  },

  // 13. Liczby rzeczywiste (Podstawa + Rozszerzenie)
  {
    id: 35,
    topicId: 'liczby-rzeczywiste',
    topicName: 'Liczby rzeczywiste',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Która z poniższych liczb ma najmniejszą wartość?',
    options: [
      { key: 'A', label: '$|-7|$' },
      { key: 'B', label: '$-(-3)$' },
      { key: 'C', label: '$-2^4$' },
      { key: 'D', label: '$(-2)^4$' },
    ],
    correctAnswer: 'C',
    hint: 'Pamiętaj o kolejności wykonywania działań: $-2^4 = -(2^4)$, natomiast $(-2)^4 = (-2)\\cdot(-2)\\cdot(-2)\\cdot(-2)$.',
    solutionSteps: [
      'Obliczamy każdą z liczb: $|-7| = 7$, $-(-3) = 3$, $-2^4 = -16$, $(-2)^4 = 16$.',
      'Najmniejsza z nich to $-16$, czyli odpowiedź **C**.',
    ],
  },
  {
    id: 36,
    topicId: 'liczby-rzeczywiste',
    topicName: 'Liczby rzeczywiste',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Dane są liczby $x = \\sqrt{7 - 4\\sqrt{3}}$ oraz $y = 2 + \\sqrt{3}$. Oblicz iloczyn $x \\cdot y$.',
    correctAnswer: '1',
    acceptedAnswers: ['1'],
    hint: 'Zapisz wyrażenie podpierwiastkowe $7 - 4\\sqrt{3}$ jako kwadrat różnicy $(a - b\\sqrt{3})^2$.',
    solutionSteps: [
      'Zauważmy, że $(2 - \\sqrt{3})^2 = 4 - 4\\sqrt{3} + 3 = 7 - 4\\sqrt{3}$.',
      'Ponieważ $2 > \\sqrt{3}$, mamy $x = \\sqrt{(2 - \\sqrt{3})^2} = |2 - \\sqrt{3}| = 2 - \\sqrt{3}$.',
      'Obliczamy iloczyn: $$x \\cdot y = (2 - \\sqrt{3})(2 + \\sqrt{3}) = 4 - 3 = 1$$',
      'Ostateczny wynik to **$1$**.',
    ],
  },

  // 14. Funkcja liniowa (Podstawa - drugie zadanie)
  {
    id: 37,
    topicId: 'funkcja-liniowa',
    topicName: 'Funkcja liniowa',
    level: 'podstawa',
    type: 'open',
    points: 1,
    question:
      'Wyznacz miejsce zerowe funkcji liniowej $f(x) = -2x + 7$. Wynik zapisz w postaci ułamka dziesiętnego.',
    correctAnswer: '3.5',
    acceptedAnswers: ['3.5', '7/2'],
    hint: 'Miejsce zerowe funkcji to argument $x$, dla którego $f(x) = 0$.',
    solutionSteps: [
      'Przyrównujemy wzór funkcji do zera: $$-2x + 7 = 0 \\implies 2x = 7 \\implies x = 3{,}5$$',
      'Miejsce zerowe wynosi **$3{,}5$**.',
    ],
  },

  // 15. Procenty (Podstawa - drugie zadanie)
  {
    id: 38,
    topicId: 'procenty',
    topicName: 'Procenty',
    level: 'podstawa',
    type: 'open',
    points: 1,
    question: 'Jakim procentem liczby $150$ jest liczba $45$? Podaj samą liczbę bez znaku procentu.',
    correctAnswer: '30',
    acceptedAnswers: ['30', '30%'],
    hint: 'Podziel $45$ przez $150$ i pomnóż otrzymany wynik przez $100$.',
    solutionSteps: [
      'Obliczamy stosunek: $$\\frac{45}{150} \\cdot 100\\% = \\frac{3}{10} \\cdot 100\\% = 30\\%$$',
      'Szukana odpowiedź to **$30$**.',
    ],
  },

  // 16. Statystyka (Podstawa)
  {
    id: 39,
    topicId: 'statystyka',
    topicName: 'Statystyka',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Średnia arytmetyczna liczb $4, 7, 10, x, 14$ jest równa $9$. Wówczas liczba $x$ wynosi:',
    options: [
      { key: 'A', label: '$8$' },
      { key: 'B', label: '$9$' },
      { key: 'C', label: '$10$' },
      { key: 'D', label: '$11$' },
    ],
    correctAnswer: 'C',
    hint: 'Suma pięciu liczb o średniej $9$ wynosi $5 \\cdot 9 = 45$.',
    solutionSteps: [
      'Układamy równanie ze wzoru na średnią: $$\\frac{4 + 7 + 10 + x + 14}{5} = 9$$',
      'Stąd $35 + x = 45 \\implies x = 10$. Poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 40,
    topicId: 'statystyka',
    topicName: 'Statystyka',
    level: 'podstawa',
    type: 'open',
    points: 1,
    question: 'Oblicz medianę zestawu danych: $12, 5, 8, 19, 8, 14$.',
    correctAnswer: '10',
    acceptedAnswers: ['10'],
    hint: 'Uporządkuj liczby niemalejąco i oblicz średnią dwóch środkowych wyrazów.',
    solutionSteps: [
      'Porządkujemy dane: $5, 8, 8, 12, 14, 19$.',
      'Zestaw ma $6$ liczb, więc mediana to średnia 3. i 4. wyrazu: $$\\frac{8 + 12}{2} = 10$$',
      'Mediana wynosi **$10$**.',
    ],
  },

  // 17. Kombinatoryka (Podstawa + Rozszerzenie)
  {
    id: 41,
    topicId: 'kombinatoryka',
    topicName: 'Kombinatoryka',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Ile jest wszystkich liczb naturalnych dwucyfrowych o obu cyfrach nieparzystych?',
    options: [
      { key: 'A', label: '$10$' },
      { key: 'B', label: '$20$' },
      { key: 'C', label: '$25$' },
      { key: 'D', label: '$50$' },
    ],
    correctAnswer: 'C',
    hint: 'Zbiór cyfr nieparzystych to $\\{1, 3, 5, 7, 9\\}$. Zastosuj regułę mnożenia.',
    solutionSteps: [
      'Mamy $5$ cyfr nieparzystych: $1, 3, 5, 7, 9$.',
      'Cyfrę dziesiątek wybieramy na $5$ sposobów, a cyfrę jedności również na $5$ sposobów: $5 \\cdot 5 = 25$.',
      'Poprawna odpowiedź to **C ($25$)**.',
    ],
  },
  {
    id: 42,
    topicId: 'kombinatoryka',
    topicName: 'Kombinatoryka',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Ile różnych wyrazów (mających sens lub nie) można utworzyć przez przestawienie wszystkich liter słowa MATURA?',
    correctAnswer: '360',
    acceptedAnswers: ['360'],
    hint: 'Słowo MATURA ma $6$ liter, przy czym litera A występuje dwukrotnie. Zastosuj permutacje z powtórzeniami.',
    solutionSteps: [
      'Liczba wszystkich liter wynosi $n = 6$, a litera A powtarza się $2$ razy.',
      'Liczba różnych permutacji: $$\\frac{6!}{2!} = \\frac{720}{2} = 360$$',
      'Ostateczny wynik to **$360$**.',
    ],
  },

  // 18. Rachunek różniczkowy (tylko Rozszerzenie)
  {
    id: 43,
    topicId: 'rachunek-rozniczkowy',
    topicName: 'Rachunek różniczkowy',
    level: 'rozszerzenie',
    type: 'closed',
    points: 1,
    question:
      'Współczynnik kierunkowy stycznej do wykresu funkcji $f(x) = x^3 - 4x + 1$ w punkcie o odciętej $x_0 = 2$ jest równy:',
    options: [
      { key: 'A', label: '$4$' },
      { key: 'B', label: '$8$' },
      { key: 'C', label: '$12$' },
      { key: 'D', label: '$16$' },
    ],
    correctAnswer: 'B',
    hint: 'Współczynnik kierunkowy stycznej w punkcie $x_0$ jest równy pochodnej $f\'(x_0)$.',
    solutionSteps: [
      'Obliczamy pochodną funkcji: $f\'(x) = 3x^2 - 4$.',
      'Dla $x_0 = 2$: $$f\'(2) = 3 \\cdot 2^2 - 4 = 12 - 4 = 8$$',
      'Poprawna odpowiedź to **B ($8$)**.',
    ],
  },
  {
    id: 44,
    topicId: 'rachunek-rozniczkowy',
    topicName: 'Rachunek różniczkowy',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question: 'Wyznacz wartość minimum lokalnego funkcji $f(x) = x^3 - 3x^2 - 9x + 7$.',
    correctAnswer: '-20',
    acceptedAnswers: ['-20'],
    hint: 'Oblicz pochodną $f\'(x)$, wyznacz miejsca zerowe pochodnej i sprawdź, gdzie jej znak zmienia się z ujemnego na dodatni.',
    solutionSteps: [
      'Pochodna funkcji: $f\'(x) = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$.',
      'Znak pochodnej zmienia się z $-$ na $+$ w punkcie $x = 3$, więc w $x = 3$ funkcja ma minimum lokalne.',
      'Obliczamy wartość funkcji w tym punkcie: $$f(3) = 3^3 - 3 \\cdot 3^2 - 9 \\cdot 3 + 7 = 27 - 27 - 27 + 7 = -20$$',
      'Minimum lokalne wynosi **$-20$**.',
    ],
  },

  // 19. Równania z parametrem (tylko Rozszerzenie)
  {
    id: 45,
    topicId: 'rownania-z-parametrem',
    topicName: 'Równania z parametrem',
    level: 'rozszerzenie',
    type: 'closed',
    points: 1,
    question:
      'Równanie kwadratowe $x^2 - 4x + m = 0$ ma dwa różne rozwiązania rzeczywiste wtedy i tylko wtedy, gdy:',
    options: [
      { key: 'A', label: '$m < 4$' },
      { key: 'B', label: '$m \\le 4$' },
      { key: 'C', label: '$m > 4$' },
      { key: 'D', label: '$m < 16$' },
    ],
    correctAnswer: 'A',
    hint: 'Równanie kwadratowe ma dwa różne rozwiązania rzeczywiste wtedy i tylko wtedy, gdy $\\Delta > 0$.',
    solutionSteps: [
      'Obliczamy wyróżnik: $\\Delta = (-4)^2 - 4 \\cdot 1 \\cdot m = 16 - 4m$.',
      'Warunek $\\Delta > 0$: $$16 - 4m > 0 \\implies 4m < 16 \\implies m < 4$$',
      'Poprawna odpowiedź to **A ($m < 4$)**.',
    ],
  },
  {
    id: 46,
    topicId: 'rownania-z-parametrem',
    topicName: 'Równania z parametrem',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Wyznacz dodatnią wartość parametru $m$, dla której równanie $x^2 - (m + 2)x + m + 5 = 0$ ma dokładnie jedno rozwiązanie.',
    correctAnswer: '4',
    acceptedAnswers: ['4'],
    hint: 'Równanie kwadratowe ma dokładnie jedno rozwiązanie wtedy, gdy $\\Delta = 0$.',
    solutionSteps: [
      'Obliczamy wyróżnik: $$\\Delta = (m + 2)^2 - 4(m + 5) = m^2 + 4m + 4 - 4m - 20 = m^2 - 16$$',
      'Przyrównujemy $\\Delta = 0$: $$m^2 - 16 = 0 \\implies m = 4 \\quad \\text{lub} \\quad m = -4$$',
      'Z warunku $m > 0$ otrzymujemy **$m = 4$**.',
    ],
  },

  // 20. Układy równań (Podstawa)
  {
    id: 47,
    topicId: 'uklady-rownan',
    topicName: 'Układy równań',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Rozwiązaniem układu równań $\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}$ jest para liczb $(x, y)$ równa:',
    options: [
      { key: 'A', label: '$(3, 1)$' },
      { key: 'B', label: '$(1, 5)$' },
      { key: 'C', label: '$(2, 3)$' },
      { key: 'D', label: '$(4, -1)$' },
    ],
    correctAnswer: 'A',
    hint: 'Dodaj oba równania stronami, aby wyeliminować niewiadomą $y$.',
    solutionSteps: [
      'Dodajemy równania stronami: $3x = 9 \\implies x = 3$.',
      'Podstawiamy do drugiego równania: $3 - y = 2 \\implies y = 1$.',
      'Rozwiązanie to $(3, 1)$, czyli odpowiedź **A**.',
    ],
  },
  {
    id: 48,
    topicId: 'uklady-rownan',
    topicName: 'Układy równań',
    level: 'podstawa',
    type: 'open',
    points: 2,
    question:
      'Para liczb $(x, y)$ spełnia układ równań $\\begin{cases} x + 2y = 11 \\\\ 3x - 2y = 5 \\end{cases}$. Oblicz iloczyn $x \\cdot y$.',
    correctAnswer: '14',
    acceptedAnswers: ['14'],
    hint: 'Dodaj oba równania stronami, aby najpierw wyznaczyć $x$, a potem oblicz $y$.',
    solutionSteps: [
      'Dodajemy równania stronami: $4x = 16 \\implies x = 4$.',
      'Podstawiamy do pierwszego równania: $4 + 2y = 11 \\implies 2y = 7 \\implies y = 3{,}5$.',
      'Iloczyn: $$x \\cdot y = 4 \\cdot 3{,}5 = 14$$',
      'Ostateczny wynik to **$14$**.',
    ],
  },

  // 21. Wartość bezwzględna (tylko Rozszerzenie)
  {
    id: 49,
    topicId: 'wartosc-bezwzgledna',
    topicName: 'Wartość bezwzględna',
    level: 'rozszerzenie',
    type: 'closed',
    points: 1,
    question: 'Suma wszystkich rozwiązań równania $|2x - 4| = 6$ jest równa:',
    options: [
      { key: 'A', label: '$2$' },
      { key: 'B', label: '$4$' },
      { key: 'C', label: '$6$' },
      { key: 'D', label: '$10$' },
    ],
    correctAnswer: 'B',
    hint: 'Rozpatrz dwa przypadki: $2x - 4 = 6$ oraz $2x - 4 = -6$.',
    solutionSteps: [
      'Przypadek 1: $2x - 4 = 6 \\implies 2x = 10 \\implies x = 5$.',
      'Przypadek 2: $2x - 4 = -6 \\implies 2x = -2 \\implies x = -1$.',
      'Suma rozwiązań: $5 + (-1) = 4$. Poprawna odpowiedź to **B**.',
    ],
  },
  {
    id: 50,
    topicId: 'wartosc-bezwzgledna',
    topicName: 'Wartość bezwzględna',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question: 'Ile rozwiązań całkowitych ma nierówność $|x - 1| + |x - 5| \\le 4$?',
    correctAnswer: '5',
    acceptedAnswers: ['5'],
    hint: 'Zinterpretuj $|x - 1| + |x - 5|$ geometrycznie jako sumę odległości punktu $x$ od liczb $1$ i $5$ na osi liczbowej.',
    solutionSteps: [
      'Odległość między punktami $1$ i $5$ na osi liczbowej wynosi $4$.',
      'Dla każdego $x \\in \\langle 1, 5 \\rangle$ suma odległości od $1$ i $5$ jest równa dokładnie $4$, a poza tym przedziałem jest większa od $4$.',
      'Liczby całkowite w przedziale $\\langle 1, 5 \\rangle$ to $1, 2, 3, 4, 5$ — jest ich dokładnie **$5$**.',
    ],
  },

  // 22. Wielomiany (Podstawa + Rozszerzenie)
  {
    id: 51,
    topicId: 'wielomiany',
    topicName: 'Wielomiany',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Wielomian $W(x) = x^3 - 9x$ po rozłożeniu na czynniki ma postać:',
    options: [
      { key: 'A', label: '$x(x - 3)^2$' },
      { key: 'B', label: '$x(x - 9)(x + 9)$' },
      { key: 'C', label: '$x(x - 3)(x + 3)$' },
      { key: 'D', label: '$(x - 3)(x + 3)$' },
    ],
    correctAnswer: 'C',
    hint: 'Wyłącz $x$ przed nawias, a następnie użyj wzoru na różnicę kwadratów.',
    solutionSteps: [
      'Wyłączamy wspólny czynnik $x$: $$W(x) = x(x^2 - 9)$$',
      'Stosujemy wzór $a^2 - b^2 = (a - b)(a + b)$: $$W(x) = x(x - 3)(x + 3)$$',
      'Poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 52,
    topicId: 'wielomiany',
    topicName: 'Wielomiany',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Reszta z dzielenia wielomianu $W(x) = 2x^3 - 3x^2 + ax - 5$ przez dwumian $(x - 2)$ wynosi $7$. Oblicz wartość współczynnika $a$.',
    correctAnswer: '4',
    acceptedAnswers: ['4'],
    hint: 'Z twierdzenia Bézouta reszta z dzielenia wielomianu $W(x)$ przez $(x - 2)$ jest równa $W(2)$.',
    solutionSteps: [
      'Z twierdzenia Bézouta mamy $W(2) = 7$.',
      'Obliczamy $W(2)$: $$2 \\cdot 2^3 - 3 \\cdot 2^2 + 2a - 5 = 7 \\implies 16 - 12 + 2a - 5 = 7$$',
      'Upraszczamy: $$2a - 1 = 7 \\implies 2a = 8 \\implies a = 4$$',
      'Współczynnik $a$ wynosi **$4$**.',
    ],
  },

  // 23. Funkcja wykładnicza (Podstawa + Rozszerzenie)
  {
    id: 53,
    topicId: 'funkcja-wykladnicza',
    topicName: 'Funkcja wykładnicza',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question: 'Wykres funkcji wykładniczej $f(x) = 3^x$ przechodzi przez punkt:',
    options: [
      { key: 'A', label: '$(0, 0)$' },
      { key: 'B', label: '$(1, 0)$' },
      { key: 'C', label: '$(2, 9)$' },
      { key: 'D', label: '$(3, 9)$' },
    ],
    correctAnswer: 'C',
    hint: 'Podstaw pierwszą współrzędną każdego punktu do wzoru $f(x) = 3^x$ i sprawdź, czy otrzymasz drugą współrzędną.',
    solutionSteps: [
      'Sprawdzamy wartość dla $x = 2$: $$f(2) = 3^2 = 9$$',
      'Punkt $(2, 9)$ należy do wykresu, czyli poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 54,
    topicId: 'funkcja-wykladnicza',
    topicName: 'Funkcja wykładnicza',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Rozwiąż równanie $4^x - 6 \\cdot 2^x + 8 = 0$ i podaj sumę wszystkich jego rozwiązań.',
    correctAnswer: '3',
    acceptedAnswers: ['3'],
    hint: 'Zastosuj podstawienie pomocnicze $t = 2^x > 0$, zauważając że $4^x = (2^x)^2 = t^2$.',
    solutionSteps: [
      'Niech $t = 2^x > 0$. Równanie przyjmuje postać: $$t^2 - 6t + 8 = 0$$',
      'Rozkładamy na czynniki: $$(t - 2)(t - 4) = 0 \\implies t = 2 \\quad \\text{lub} \\quad t = 4$$',
      'Wracamy do zmiennej $x$: $2^x = 2 \\implies x = 1$ oraz $2^x = 4 \\implies x = 2$.',
      'Suma rozwiązań: $1 + 2 =$ **$3$**.',
    ],
  },

  // 24. Optymalizacja (Podstawa + Rozszerzenie)
  {
    id: 55,
    topicId: 'optymalizacja',
    topicName: 'Optymalizacja',
    level: 'podstawa',
    type: 'closed',
    points: 1,
    question:
      'Suma dwóch liczb rzeczywistych dodatnich $x$ i $y$ jest równa $20$. Największe możliwe pole prostokąta o bokach długości $x$ i $y$ wynosi:',
    options: [
      { key: 'A', label: '$80$' },
      { key: 'B', label: '$96$' },
      { key: 'C', label: '$100$' },
      { key: 'D', label: '$120$' },
    ],
    correctAnswer: 'C',
    hint: 'Wyraź drugi bok jako $y = 20 - x$ i znajdź wierzchołek paraboli $P(x) = x(20 - x)$.',
    solutionSteps: [
      'Pole prostokąta to $P(x) = x(20 - x) = -x^2 + 20x$ dla $x \\in (0, 20)$.',
      'Pierwsza współrzędna wierzchołka: $x = -\\frac{20}{-2} = 10$.',
      'Największe pole: $P(10) = 10 \\cdot (20 - 10) = 100$. Poprawna odpowiedź to **C**.',
    ],
  },
  {
    id: 56,
    topicId: 'optymalizacja',
    topicName: 'Optymalizacja',
    level: 'rozszerzenie',
    type: 'open',
    points: 2,
    question:
      'Z drutu o długości $48\\text{ cm}$ zbudowano szkielet prostopadłościanu o podstawie kwadratowej (krawędź podstawy $a$, wysokość $h$). Oblicz długość krawędzi podstawy $a$ (w cm), dla której objętość bryły jest największa.',
    correctAnswer: '4',
    acceptedAnswers: ['4'],
    hint: 'Zapisz warunek na sumę wszystkich krawędzi: $8a + 4h = 48$, wyraź $V(a) = a^2 h$ jako funkcję jednej zmiennej i wyznacz jej maksimum za pomocą pochodnej.',
    solutionSteps: [
      'Z sumy krawędzi: $8a + 4h = 48 \\implies h = 12 - 2a$ (dziedzina: $a \\in (0, 6)$).',
      'Objętość bryły: $$V(a) = a^2(12 - 2a) = 12a^2 - 2a^3$$',
      'Obliczamy pochodną: $V\'(a) = 24a - 6a^2 = 6a(4 - a)$.',
      'W przedziale $(0, 6)$ pochodna zeruje się w $a = 4$, zmieniając znak z $+$ na $-$. Objętość jest największa dla **$a = 4$**.',
    ],
  },

  // 25. Inne (Podstawa)
  {
    id: 57,
    topicId: 'inne',
    topicName: 'Inne',
    level: 'podstawa',
    type: 'open',
    points: 1,
    question:
      'W pewnej klasie stosunek liczby dziewcząt do liczby chłopców wynosi $3 : 5$. Jeśli w klasie jest $15$ chłopców, to ilu uczniów liczy cała klasa?',
    correctAnswer: '24',
    acceptedAnswers: ['24'],
    hint: 'Oznacz liczbę dziewcząt jako $3k$, a liczbę chłopców jako $5k$.',
    solutionSteps: [
      'Z proporcji $5k = 15 \\implies k = 3$.',
      'Liczba dziewcząt wynosi $3k = 3 \\cdot 3 = 9$.',
      'Cała klasa liczy $9 + 15 =$ **$24$** uczniów.',
    ],
  },
];
