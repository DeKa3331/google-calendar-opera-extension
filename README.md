# Google Calendar – Opera Extension

Rozszerzenie do przeglądarki **Opera**, które po kliknięciu ikonki otwiera małe okno z podglądem **Kalendarza Google**: dzisiejszego dnia albo całego tygodnia.

## Funkcje

- **Dziś / Tydzień**: przełącznik widoku (lista wydarzeń albo siatka tygodnia od poniedziałku)
- **‹ ›**: poprzedni / następny dzień lub tydzień, **●** wraca do dzisiaj
- **↗**: otwiera ten sam dzień/tydzień w pełnym Kalendarzu Google w nowej karcie
- **⚙**: ustawienia (które kalendarze pokazać, strefa czasowa)
- Okno pojawia się przy prawej krawędzi okna Opery, ponowne kliknięcie ikonki je zamyka, a kliknięcie gdzie indziej chowa je automatycznie
- Pamięta ostatnio wybrany widok

## Instalacja

1. Pobierz kod: **Code → Download ZIP** (albo `git clone`) i rozpakuj.
2. W Operze otwórz `opera://extensions`.
3. Włącz **Tryb programisty** (przełącznik w prawym górnym rogu).
4. Kliknij **Załaduj rozpakowane** i wskaż folder, w którym bezpośrednio leży plik `manifest.json`.
   > Uwaga: Windows przy „Wyodrębnij wszystko” często tworzy podwójny folder (`nazwa\nazwa\`). Wybierz ten wewnętrzny.
5. (Opcjonalnie) Przypnij ikonkę: kliknij ikonę puzzla obok paska adresu i przypnij „Podgląd Kalendarza Google”.

## Pierwsze uruchomienie

1. Kliknij ikonkę kalendarza, a potem **⚙**.
2. W polu **Kalendarze do pokazania** wpisz swój adres Gmail. To jest ID Twojego głównego kalendarza.
   Kolejne kalendarze możesz dodać po przecinku. Ich ID znajdziesz w Kalendarzu Google → ⚙ Ustawienia → wybrany kalendarz → **Integracja kalendarza → Identyfikator kalendarza**.
3. Kliknij **Zapisz** i otwórz kalendarz ikonką.

**Wymaganie:** musisz być zalogowany do konta Google w Operze. Rozszerzenie korzysta z oficjalnego widoku osadzonego Google (`calendar.google.com/calendar/embed`), więc prywatne wydarzenia widać tylko przy aktywnej sesji Google. Jeśli zamiast wydarzeń widzisz pusty widok albo prośbę o logowanie, sprawdź, czy Opera nie blokuje plików cookie innych firm dla `calendar.google.com`.

## Aktualizacja

Podmień pliki w folderze rozszerzenia (albo `git pull`), a potem w `opera://extensions` kliknij ikonkę odświeżania przy rozszerzeniu.

## Dostosowanie

Na początku pliku `background.js`:

| Stała | Znaczenie | Domyślnie |
|---|---|---|
| `OFFSET_TOP` | odstęp okna od górnej krawędzi okna Opery (px) | `140` |
| `MARGIN_RIGHT` | odstęp od prawej krawędzi (px) | `16` |
| `SIZES` | rozmiar okna dla widoku dzień / tydzień | `460×640` / `860×640` |

## Struktura

```
manifest.json    # Manifest V3
background.js    # otwieranie/zamykanie okna, pozycjonowanie
popup.html/css/js# interfejs okna z kalendarzem
options.html/js  # ustawienia
icons/           # ikonki
```

## Ograniczenia

- Widok osadzony Google służy tylko do podglądu: nie da się w nim dodawać ani edytować wydarzeń (do tego jest przycisk ↗).
- W widoku „Dziś” Google pokazuje listę nadchodzących wydarzeń, która może sięgać kolejnych dni.

## Pomysły na dalszy rozwój

- Wersja oparta o Google Calendar API (OAuth): własny wygląd, licznik wydarzeń na ikonce, szybkie dodawanie wydarzeń.
