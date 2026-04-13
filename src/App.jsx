import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase'

// ============================================================
// VOKABELDATEN — Erweitertes Vokabular (~100 Einträge)
// ============================================================
const VOCAB = [
  // --- Begrüßung & Höflichkeit (16) ---
  { id: 'b01', sl: 'Dober dan', de: 'Guten Tag', cat: 'Begrüßung', level: 1 },
  { id: 'b02', sl: 'Zdravo', de: 'Hallo', cat: 'Begrüßung', level: 1 },
  { id: 'b03', sl: 'Hvala', de: 'Danke', cat: 'Begrüßung', level: 1 },
  { id: 'b04', sl: 'Prosim', de: 'Bitte', cat: 'Begrüßung', level: 1 },
  { id: 'b05', sl: 'Da', de: 'Ja', cat: 'Begrüßung', level: 1 },
  { id: 'b06', sl: 'Ne', de: 'Nein', cat: 'Begrüßung', level: 1 },
  { id: 'b07', sl: 'Nasvidenje', de: 'Auf Wiedersehen', cat: 'Begrüßung', level: 1 },
  { id: 'b08', sl: 'Dobro jutro', de: 'Guten Morgen', cat: 'Begrüßung', level: 1 },
  { id: 'b09', sl: 'Dober večer', de: 'Guten Abend', cat: 'Begrüßung', level: 1 },
  { id: 'b10', sl: 'Lahko noč', de: 'Gute Nacht', cat: 'Begrüßung', level: 1 },
  { id: 'b11', sl: 'Oprostite', de: 'Entschuldigung', cat: 'Begrüßung', level: 1 },
  { id: 'b12', sl: 'Kako se imate?', de: 'Wie geht es Ihnen?', cat: 'Begrüßung', level: 1 },
  { id: 'b13', sl: 'Kako si?', de: 'Wie geht es dir?', cat: 'Begrüßung', level: 1 },
  { id: 'b14', sl: 'Hvala lepa', de: 'Vielen Dank', cat: 'Begrüßung', level: 1 },
  { id: 'b15', sl: 'Ni za kaj', de: 'Keine Ursache', cat: 'Begrüßung', level: 2 },
  { id: 'b16', sl: 'Živjo', de: 'Hi / Tschüss', cat: 'Begrüßung', level: 1 },

  // --- Zahlen (15) ---
  { id: 'z01', sl: 'ena', de: 'eins', cat: 'Zahlen', level: 1 },
  { id: 'z02', sl: 'dva', de: 'zwei', cat: 'Zahlen', level: 1 },
  { id: 'z03', sl: 'tri', de: 'drei', cat: 'Zahlen', level: 1 },
  { id: 'z04', sl: 'štiri', de: 'vier', cat: 'Zahlen', level: 1 },
  { id: 'z05', sl: 'pet', de: 'fünf', cat: 'Zahlen', level: 1 },
  { id: 'z06', sl: 'šest', de: 'sechs', cat: 'Zahlen', level: 1 },
  { id: 'z07', sl: 'sedem', de: 'sieben', cat: 'Zahlen', level: 1 },
  { id: 'z08', sl: 'osem', de: 'acht', cat: 'Zahlen', level: 1 },
  { id: 'z09', sl: 'devet', de: 'neun', cat: 'Zahlen', level: 1 },
  { id: 'z10', sl: 'deset', de: 'zehn', cat: 'Zahlen', level: 1 },
  { id: 'z11', sl: 'dvajset', de: 'zwanzig', cat: 'Zahlen', level: 2 },
  { id: 'z12', sl: 'trideset', de: 'dreißig', cat: 'Zahlen', level: 2 },
  { id: 'z13', sl: 'sto', de: 'hundert', cat: 'Zahlen', level: 2 },
  { id: 'z14', sl: 'tisoč', de: 'tausend', cat: 'Zahlen', level: 2 },
  { id: 'z15', sl: 'nič', de: 'null', cat: 'Zahlen', level: 1 },

  // --- Essen & Trinken (14) ---
  { id: 'e01', sl: 'voda', de: 'Wasser', cat: 'Essen & Trinken', level: 1 },
  { id: 'e02', sl: 'kruh', de: 'Brot', cat: 'Essen & Trinken', level: 1 },
  { id: 'e03', sl: 'mleko', de: 'Milch', cat: 'Essen & Trinken', level: 1 },
  { id: 'e04', sl: 'kava', de: 'Kaffee', cat: 'Essen & Trinken', level: 1 },
  { id: 'e05', sl: 'čaj', de: 'Tee', cat: 'Essen & Trinken', level: 1 },
  { id: 'e06', sl: 'pivo', de: 'Bier', cat: 'Essen & Trinken', level: 1 },
  { id: 'e07', sl: 'vino', de: 'Wein', cat: 'Essen & Trinken', level: 1 },
  { id: 'e08', sl: 'jabolko', de: 'Apfel', cat: 'Essen & Trinken', level: 1 },
  { id: 'e09', sl: 'sir', de: 'Käse', cat: 'Essen & Trinken', level: 1 },
  { id: 'e10', sl: 'meso', de: 'Fleisch', cat: 'Essen & Trinken', level: 1 },
  { id: 'e11', sl: 'solata', de: 'Salat', cat: 'Essen & Trinken', level: 2 },
  { id: 'e12', sl: 'juha', de: 'Suppe', cat: 'Essen & Trinken', level: 2 },
  { id: 'e13', sl: 'sladoled', de: 'Eis (Speiseeis)', cat: 'Essen & Trinken', level: 2 },
  { id: 'e14', sl: 'pomaranča', de: 'Orange', cat: 'Essen & Trinken', level: 2 },

  // --- Familie & Menschen (12) ---
  { id: 'f01', sl: 'mama', de: 'Mama', cat: 'Familie', level: 1 },
  { id: 'f02', sl: 'oče', de: 'Vater', cat: 'Familie', level: 1 },
  { id: 'f03', sl: 'brat', de: 'Bruder', cat: 'Familie', level: 1 },
  { id: 'f04', sl: 'sestra', de: 'Schwester', cat: 'Familie', level: 1 },
  { id: 'f05', sl: 'prijatelj', de: 'Freund', cat: 'Familie', level: 1 },
  { id: 'f06', sl: 'otrok', de: 'Kind', cat: 'Familie', level: 1 },
  { id: 'f07', sl: 'babica', de: 'Oma', cat: 'Familie', level: 1 },
  { id: 'f08', sl: 'dedek', de: 'Opa', cat: 'Familie', level: 1 },
  { id: 'f09', sl: 'družina', de: 'Familie', cat: 'Familie', level: 2 },
  { id: 'f10', sl: 'prijateljica', de: 'Freundin', cat: 'Familie', level: 2 },
  { id: 'f11', sl: 'bratranec', de: 'Cousin', cat: 'Familie', level: 2 },
  { id: 'f12', sl: 'sestrična', de: 'Cousine', cat: 'Familie', level: 2 },

  // --- Orte & Natur (12) ---
  { id: 'o01', sl: 'hiša', de: 'Haus', cat: 'Orte', level: 1 },
  { id: 'o02', sl: 'šola', de: 'Schule', cat: 'Orte', level: 1 },
  { id: 'o03', sl: 'mesto', de: 'Stadt', cat: 'Orte', level: 1 },
  { id: 'o04', sl: 'Ljubljana', de: 'Ljubljana (Hauptstadt)', cat: 'Orte', level: 1 },
  { id: 'o05', sl: 'Slovenija', de: 'Slowenien', cat: 'Orte', level: 1 },
  { id: 'o06', sl: 'gora', de: 'Berg', cat: 'Orte', level: 1 },
  { id: 'o07', sl: 'morje', de: 'Meer', cat: 'Orte', level: 1 },
  { id: 'o08', sl: 'jezero', de: 'See', cat: 'Orte', level: 1 },
  { id: 'o09', sl: 'reka', de: 'Fluss', cat: 'Orte', level: 2 },
  { id: 'o10', sl: 'gozd', de: 'Wald', cat: 'Orte', level: 2 },
  { id: 'o11', sl: 'plaža', de: 'Strand', cat: 'Orte', level: 2 },
  { id: 'o12', sl: 'trgovina', de: 'Geschäft', cat: 'Orte', level: 2 },

  // --- Nützliche Sätze (15) ---
  { id: 's01', sl: 'Koliko stane?', de: 'Wie viel kostet das?', cat: 'Sätze', level: 1 },
  { id: 's02', sl: 'Ne razumem', de: 'Ich verstehe nicht', cat: 'Sätze', level: 1 },
  { id: 's03', sl: 'Govorite nemško?', de: 'Sprechen Sie Deutsch?', cat: 'Sätze', level: 1 },
  { id: 's04', sl: 'Kje je ...?', de: 'Wo ist ...?', cat: 'Sätze', level: 1 },
  { id: 's05', sl: 'Jaz sem ...', de: 'Ich bin ...', cat: 'Sätze', level: 1 },
  { id: 's06', sl: 'Imam rad', de: 'Ich mag (m)', cat: 'Sätze', level: 1 },
  { id: 's07', sl: 'Lepo je', de: 'Es ist schön', cat: 'Sätze', level: 1 },
  { id: 's08', sl: 'Dober tek', de: 'Guten Appetit', cat: 'Sätze', level: 1 },
  { id: 's09', sl: 'Na zdravje', de: 'Prost / Gesundheit', cat: 'Sätze', level: 1 },
  { id: 's10', sl: 'Rad bi ...', de: 'Ich möchte ...', cat: 'Sätze', level: 1 },
  { id: 's11', sl: 'Pomoč!', de: 'Hilfe!', cat: 'Sätze', level: 2 },
  { id: 's12', sl: 'Vse najboljše!', de: 'Alles Gute!', cat: 'Sätze', level: 2 },
  { id: 's13', sl: 'Imam rada', de: 'Ich mag (f)', cat: 'Sätze', level: 2 },
  { id: 's14', sl: 'Kako se reče ...?', de: 'Wie sagt man ...?', cat: 'Sätze', level: 2 },
  { id: 's15', sl: 'Lahko ponovite?', de: 'Können Sie wiederholen?', cat: 'Sätze', level: 2 },

  // --- Farben (8) ---
  { id: 'c01', sl: 'rdeča', de: 'rot', cat: 'Farben', level: 1 },
  { id: 'c02', sl: 'modra', de: 'blau', cat: 'Farben', level: 1 },
  { id: 'c03', sl: 'zelena', de: 'grün', cat: 'Farben', level: 1 },
  { id: 'c04', sl: 'bela', de: 'weiß', cat: 'Farben', level: 1 },
  { id: 'c05', sl: 'črna', de: 'schwarz', cat: 'Farben', level: 1 },
  { id: 'c06', sl: 'rumena', de: 'gelb', cat: 'Farben', level: 2 },
  { id: 'c07', sl: 'oranžna', de: 'orange', cat: 'Farben', level: 2 },
  { id: 'c08', sl: 'rjava', de: 'braun', cat: 'Farben', level: 2 },

  // --- Körper & Gesundheit (8) ---
  { id: 'k01', sl: 'glava', de: 'Kopf', cat: 'Körper', level: 2 },
  { id: 'k02', sl: 'roka', de: 'Hand / Arm', cat: 'Körper', level: 2 },
  { id: 'k03', sl: 'noga', de: 'Bein / Fuß', cat: 'Körper', level: 2 },
  { id: 'k04', sl: 'oči', de: 'Augen', cat: 'Körper', level: 2 },
  { id: 'k05', sl: 'srce', de: 'Herz', cat: 'Körper', level: 2 },
  { id: 'k06', sl: 'zdravnik', de: 'Arzt', cat: 'Körper', level: 2 },
  { id: 'k07', sl: 'lekarna', de: 'Apotheke', cat: 'Körper', level: 2 },
  { id: 'k08', sl: 'bolan', de: 'krank', cat: 'Körper', level: 2 },

  // --- Zeit & Wochentage (10) ---
  { id: 't01', sl: 'danes', de: 'heute', cat: 'Zeit', level: 1 },
  { id: 't02', sl: 'jutri', de: 'morgen', cat: 'Zeit', level: 1 },
  { id: 't03', sl: 'včeraj', de: 'gestern', cat: 'Zeit', level: 2 },
  { id: 't04', sl: 'ponedeljek', de: 'Montag', cat: 'Zeit', level: 2 },
  { id: 't05', sl: 'torek', de: 'Dienstag', cat: 'Zeit', level: 2 },
  { id: 't06', sl: 'sreda', de: 'Mittwoch', cat: 'Zeit', level: 2 },
  { id: 't07', sl: 'četrtek', de: 'Donnerstag', cat: 'Zeit', level: 2 },
  { id: 't08', sl: 'petek', de: 'Freitag', cat: 'Zeit', level: 2 },
  { id: 't09', sl: 'sobota', de: 'Samstag', cat: 'Zeit', level: 2 },
  { id: 't10', sl: 'nedelja', de: 'Sonntag', cat: 'Zeit', level: 2 },
  { id: 't11', sl: 'teden', de: 'Woche', cat: 'Zeit', level: 2 },
  { id: 't12', sl: 'mesec', de: 'Monat', cat: 'Zeit', level: 2 },
  { id: 't13', sl: 'leto', de: 'Jahr', cat: 'Zeit', level: 2 },
  { id: 't14', sl: 'ura', de: 'Stunde / Uhr', cat: 'Zeit', level: 2 },
  { id: 't15', sl: 'zdaj', de: 'jetzt', cat: 'Zeit', level: 1 },
  { id: 't16', sl: 'pozneje', de: 'später', cat: 'Zeit', level: 2 },
  { id: 't17', sl: 'vedno', de: 'immer', cat: 'Zeit', level: 2 },
  { id: 't18', sl: 'nikoli', de: 'nie', cat: 'Zeit', level: 2 },

  // --- Pronomen (10) ---
  { id: 'p01', sl: 'jaz', de: 'ich', cat: 'Pronomen', level: 1 },
  { id: 'p02', sl: 'ti', de: 'du', cat: 'Pronomen', level: 1 },
  { id: 'p03', sl: 'on', de: 'er', cat: 'Pronomen', level: 1 },
  { id: 'p04', sl: 'ona', de: 'sie (Einzahl)', cat: 'Pronomen', level: 1 },
  { id: 'p05', sl: 'mi', de: 'wir', cat: 'Pronomen', level: 1 },
  { id: 'p06', sl: 'vi', de: 'ihr / Sie', cat: 'Pronomen', level: 1 },
  { id: 'p07', sl: 'oni', de: 'sie (Mehrzahl)', cat: 'Pronomen', level: 2 },
  { id: 'p08', sl: 'moj', de: 'mein', cat: 'Pronomen', level: 2 },
  { id: 'p09', sl: 'tvoj', de: 'dein', cat: 'Pronomen', level: 2 },
  { id: 'p10', sl: 'kdo', de: 'wer', cat: 'Pronomen', level: 1 },

  // --- Fragewörter (8) ---
  { id: 'q01', sl: 'kaj', de: 'was', cat: 'Fragewörter', level: 1 },
  { id: 'q02', sl: 'kje', de: 'wo', cat: 'Fragewörter', level: 1 },
  { id: 'q03', sl: 'kdaj', de: 'wann', cat: 'Fragewörter', level: 1 },
  { id: 'q04', sl: 'zakaj', de: 'warum', cat: 'Fragewörter', level: 1 },
  { id: 'q05', sl: 'kako', de: 'wie', cat: 'Fragewörter', level: 1 },
  { id: 'q06', sl: 'koliko', de: 'wie viel', cat: 'Fragewörter', level: 1 },
  { id: 'q07', sl: 'kateri', de: 'welcher', cat: 'Fragewörter', level: 2 },
  { id: 'q08', sl: 'kam', de: 'wohin', cat: 'Fragewörter', level: 2 },

  // --- Verben (20) ---
  { id: 'v01', sl: 'biti', de: 'sein', cat: 'Verben', level: 1 },
  { id: 'v02', sl: 'imeti', de: 'haben', cat: 'Verben', level: 1 },
  { id: 'v03', sl: 'iti', de: 'gehen', cat: 'Verben', level: 1 },
  { id: 'v04', sl: 'priti', de: 'kommen', cat: 'Verben', level: 1 },
  { id: 'v05', sl: 'videti', de: 'sehen', cat: 'Verben', level: 1 },
  { id: 'v06', sl: 'slišati', de: 'hören', cat: 'Verben', level: 2 },
  { id: 'v07', sl: 'govoriti', de: 'sprechen', cat: 'Verben', level: 1 },
  { id: 'v08', sl: 'razumeti', de: 'verstehen', cat: 'Verben', level: 1 },
  { id: 'v09', sl: 'vedeti', de: 'wissen', cat: 'Verben', level: 1 },
  { id: 'v10', sl: 'misliti', de: 'denken', cat: 'Verben', level: 2 },
  { id: 'v11', sl: 'jesti', de: 'essen', cat: 'Verben', level: 1 },
  { id: 'v12', sl: 'piti', de: 'trinken', cat: 'Verben', level: 1 },
  { id: 'v13', sl: 'spati', de: 'schlafen', cat: 'Verben', level: 1 },
  { id: 'v14', sl: 'delati', de: 'arbeiten / machen', cat: 'Verben', level: 1 },
  { id: 'v15', sl: 'živeti', de: 'leben', cat: 'Verben', level: 2 },
  { id: 'v16', sl: 'ljubiti', de: 'lieben', cat: 'Verben', level: 2 },
  { id: 'v17', sl: 'hoteti', de: 'wollen', cat: 'Verben', level: 1 },
  { id: 'v18', sl: 'moči', de: 'können', cat: 'Verben', level: 1 },
  { id: 'v19', sl: 'kupiti', de: 'kaufen', cat: 'Verben', level: 2 },
  { id: 'v20', sl: 'pomagati', de: 'helfen', cat: 'Verben', level: 2 },

  // --- Adjektive (18) ---
  { id: 'a01', sl: 'dober', de: 'gut', cat: 'Adjektive', level: 1 },
  { id: 'a02', sl: 'slab', de: 'schlecht', cat: 'Adjektive', level: 1 },
  { id: 'a03', sl: 'velik', de: 'groß', cat: 'Adjektive', level: 1 },
  { id: 'a04', sl: 'majhen', de: 'klein', cat: 'Adjektive', level: 1 },
  { id: 'a05', sl: 'lep', de: 'schön', cat: 'Adjektive', level: 1 },
  { id: 'a06', sl: 'grd', de: 'hässlich', cat: 'Adjektive', level: 2 },
  { id: 'a07', sl: 'nov', de: 'neu', cat: 'Adjektive', level: 1 },
  { id: 'a08', sl: 'star', de: 'alt', cat: 'Adjektive', level: 1 },
  { id: 'a09', sl: 'hiter', de: 'schnell', cat: 'Adjektive', level: 2 },
  { id: 'a10', sl: 'počasen', de: 'langsam', cat: 'Adjektive', level: 2 },
  { id: 'a11', sl: 'topel', de: 'warm', cat: 'Adjektive', level: 1 },
  { id: 'a12', sl: 'hladen', de: 'kalt', cat: 'Adjektive', level: 2 },
  { id: 'a13', sl: 'vroč', de: 'heiß', cat: 'Adjektive', level: 2 },
  { id: 'a14', sl: 'lačen', de: 'hungrig', cat: 'Adjektive', level: 1 },
  { id: 'a15', sl: 'žejen', de: 'durstig', cat: 'Adjektive', level: 1 },
  { id: 'a16', sl: 'utrujen', de: 'müde', cat: 'Adjektive', level: 1 },
  { id: 'a17', sl: 'vesel', de: 'fröhlich', cat: 'Adjektive', level: 2 },
  { id: 'a18', sl: 'žalosten', de: 'traurig', cat: 'Adjektive', level: 2 },

  // --- Alltag (15) ---
  { id: 'd01', sl: 'denar', de: 'Geld', cat: 'Alltag', level: 1 },
  { id: 'd02', sl: 'avto', de: 'Auto', cat: 'Alltag', level: 1 },
  { id: 'd03', sl: 'telefon', de: 'Telefon / Handy', cat: 'Alltag', level: 1 },
  { id: 'd04', sl: 'knjiga', de: 'Buch', cat: 'Alltag', level: 1 },
  { id: 'd05', sl: 'ključ', de: 'Schlüssel', cat: 'Alltag', level: 2 },
  { id: 'd06', sl: 'vrata', de: 'Tür', cat: 'Alltag', level: 2 },
  { id: 'd07', sl: 'okno', de: 'Fenster', cat: 'Alltag', level: 2 },
  { id: 'd08', sl: 'miza', de: 'Tisch', cat: 'Alltag', level: 2 },
  { id: 'd09', sl: 'stol', de: 'Stuhl', cat: 'Alltag', level: 2 },
  { id: 'd10', sl: 'postelja', de: 'Bett', cat: 'Alltag', level: 2 },
  { id: 'd11', sl: 'delo', de: 'Arbeit', cat: 'Alltag', level: 1 },
  { id: 'd12', sl: 'služba', de: 'Job', cat: 'Alltag', level: 2 },
  { id: 'd13', sl: 'glasba', de: 'Musik', cat: 'Alltag', level: 2 },
  { id: 'd14', sl: 'film', de: 'Film', cat: 'Alltag', level: 1 },
  { id: 'd15', sl: 'igra', de: 'Spiel', cat: 'Alltag', level: 2 },

  // --- Wetter & Natur (10) ---
  { id: 'w01', sl: 'sonce', de: 'Sonne', cat: 'Wetter', level: 1 },
  { id: 'w02', sl: 'dež', de: 'Regen', cat: 'Wetter', level: 1 },
  { id: 'w03', sl: 'sneg', de: 'Schnee', cat: 'Wetter', level: 1 },
  { id: 'w04', sl: 'veter', de: 'Wind', cat: 'Wetter', level: 2 },
  { id: 'w05', sl: 'oblak', de: 'Wolke', cat: 'Wetter', level: 2 },
  { id: 'w06', sl: 'nebo', de: 'Himmel', cat: 'Wetter', level: 2 },
  { id: 'w07', sl: 'drevo', de: 'Baum', cat: 'Wetter', level: 2 },
  { id: 'w08', sl: 'cvet', de: 'Blume', cat: 'Wetter', level: 2 },
  { id: 'w09', sl: 'pes', de: 'Hund', cat: 'Wetter', level: 1 },
  { id: 'w10', sl: 'mačka', de: 'Katze', cat: 'Wetter', level: 1 },

  // --- Richtungen & Position (8) ---
  { id: 'r01', sl: 'levo', de: 'links', cat: 'Richtungen', level: 1 },
  { id: 'r02', sl: 'desno', de: 'rechts', cat: 'Richtungen', level: 1 },
  { id: 'r03', sl: 'zgoraj', de: 'oben', cat: 'Richtungen', level: 2 },
  { id: 'r04', sl: 'spodaj', de: 'unten', cat: 'Richtungen', level: 2 },
  { id: 'r05', sl: 'naravnost', de: 'geradeaus', cat: 'Richtungen', level: 2 },
  { id: 'r06', sl: 'tukaj', de: 'hier', cat: 'Richtungen', level: 1 },
  { id: 'r07', sl: 'tam', de: 'dort', cat: 'Richtungen', level: 1 },
  { id: 'r08', sl: 'blizu', de: 'nah', cat: 'Richtungen', level: 2 },

  // --- Weitere Alltagssätze (10) ---
  { id: 's16', sl: 'Kako se imenuješ?', de: 'Wie heißt du?', cat: 'Sätze', level: 1 },
  { id: 's17', sl: 'Od kod si?', de: 'Woher kommst du?', cat: 'Sätze', level: 1 },
  { id: 's18', sl: 'Koliko je ura?', de: 'Wie spät ist es?', cat: 'Sätze', level: 1 },
  { id: 's19', sl: 'Sem lačen', de: 'Ich habe Hunger', cat: 'Sätze', level: 1 },
  { id: 's20', sl: 'Sem žejen', de: 'Ich habe Durst', cat: 'Sätze', level: 1 },
  { id: 's21', sl: 'Sem utrujen', de: 'Ich bin müde', cat: 'Sätze', level: 1 },
  { id: 's22', sl: 'Ne vem', de: 'Ich weiß nicht', cat: 'Sätze', level: 1 },
  { id: 's23', sl: 'Govorim malo slovensko', de: 'Ich spreche ein wenig Slowenisch', cat: 'Sätze', level: 2 },
  { id: 's24', sl: 'Super!', de: 'Super! / Toll!', cat: 'Sätze', level: 1 },
  { id: 's25', sl: 'Se vidimo!', de: 'Bis später!', cat: 'Sätze', level: 2 },

  // --- Mehr Essen & Trinken (30) ---
  { id: 'e15', sl: 'banana', de: 'Banane', cat: 'Essen & Trinken', level: 1 },
  { id: 'e16', sl: 'sadje', de: 'Obst', cat: 'Essen & Trinken', level: 1 },
  { id: 'e17', sl: 'zelenjava', de: 'Gemüse', cat: 'Essen & Trinken', level: 1 },
  { id: 'e18', sl: 'riba', de: 'Fisch', cat: 'Essen & Trinken', level: 1 },
  { id: 'e19', sl: 'riž', de: 'Reis', cat: 'Essen & Trinken', level: 1 },
  { id: 'e20', sl: 'testenine', de: 'Pasta / Nudeln', cat: 'Essen & Trinken', level: 2 },
  { id: 'e21', sl: 'krompir', de: 'Kartoffel', cat: 'Essen & Trinken', level: 1 },
  { id: 'e22', sl: 'paradižnik', de: 'Tomate', cat: 'Essen & Trinken', level: 2 },
  { id: 'e23', sl: 'kumara', de: 'Gurke', cat: 'Essen & Trinken', level: 2 },
  { id: 'e24', sl: 'paprika', de: 'Paprika', cat: 'Essen & Trinken', level: 2 },
  { id: 'e25', sl: 'čebula', de: 'Zwiebel', cat: 'Essen & Trinken', level: 2 },
  { id: 'e26', sl: 'česen', de: 'Knoblauch', cat: 'Essen & Trinken', level: 2 },
  { id: 'e27', sl: 'sol', de: 'Salz', cat: 'Essen & Trinken', level: 1 },
  { id: 'e28', sl: 'poper', de: 'Pfeffer', cat: 'Essen & Trinken', level: 2 },
  { id: 'e29', sl: 'sladkor', de: 'Zucker', cat: 'Essen & Trinken', level: 1 },
  { id: 'e30', sl: 'maslo', de: 'Butter', cat: 'Essen & Trinken', level: 1 },
  { id: 'e31', sl: 'olje', de: 'Öl', cat: 'Essen & Trinken', level: 2 },
  { id: 'e32', sl: 'med', de: 'Honig', cat: 'Essen & Trinken', level: 2 },
  { id: 'e33', sl: 'marmelada', de: 'Marmelade', cat: 'Essen & Trinken', level: 2 },
  { id: 'e34', sl: 'jajce', de: 'Ei', cat: 'Essen & Trinken', level: 1 },
  { id: 'e35', sl: 'piščanec', de: 'Hähnchen', cat: 'Essen & Trinken', level: 2 },
  { id: 'e36', sl: 'svinjina', de: 'Schweinefleisch', cat: 'Essen & Trinken', level: 2 },
  { id: 'e37', sl: 'govedina', de: 'Rindfleisch', cat: 'Essen & Trinken', level: 2 },
  { id: 'e38', sl: 'klobasa', de: 'Wurst', cat: 'Essen & Trinken', level: 2 },
  { id: 'e39', sl: 'čokolada', de: 'Schokolade', cat: 'Essen & Trinken', level: 1 },
  { id: 'e40', sl: 'torta', de: 'Torte / Kuchen', cat: 'Essen & Trinken', level: 1 },
  { id: 'e41', sl: 'piškot', de: 'Keks', cat: 'Essen & Trinken', level: 2 },
  { id: 'e42', sl: 'sok', de: 'Saft', cat: 'Essen & Trinken', level: 1 },
  { id: 'e43', sl: 'limonada', de: 'Limonade', cat: 'Essen & Trinken', level: 2 },
  { id: 'e44', sl: 'zajtrk', de: 'Frühstück', cat: 'Essen & Trinken', level: 1 },
  { id: 'e45', sl: 'kosilo', de: 'Mittagessen', cat: 'Essen & Trinken', level: 1 },
  { id: 'e46', sl: 'večerja', de: 'Abendessen', cat: 'Essen & Trinken', level: 1 },

  // --- Mehr Verben (30) ---
  { id: 'v21', sl: 'pisati', de: 'schreiben', cat: 'Verben', level: 1 },
  { id: 'v22', sl: 'brati', de: 'lesen', cat: 'Verben', level: 1 },
  { id: 'v23', sl: 'hoditi', de: 'laufen / gehen', cat: 'Verben', level: 1 },
  { id: 'v24', sl: 'teči', de: 'rennen', cat: 'Verben', level: 2 },
  { id: 'v25', sl: 'plavati', de: 'schwimmen', cat: 'Verben', level: 2 },
  { id: 'v26', sl: 'plesati', de: 'tanzen', cat: 'Verben', level: 2 },
  { id: 'v27', sl: 'peti', de: 'singen', cat: 'Verben', level: 2 },
  { id: 'v28', sl: 'smejati se', de: 'lachen', cat: 'Verben', level: 2 },
  { id: 'v29', sl: 'jokati', de: 'weinen', cat: 'Verben', level: 2 },
  { id: 'v30', sl: 'vprašati', de: 'fragen', cat: 'Verben', level: 1 },
  { id: 'v31', sl: 'odgovoriti', de: 'antworten', cat: 'Verben', level: 2 },
  { id: 'v32', sl: 'pokazati', de: 'zeigen', cat: 'Verben', level: 2 },
  { id: 'v33', sl: 'vzeti', de: 'nehmen', cat: 'Verben', level: 1 },
  { id: 'v34', sl: 'dati', de: 'geben', cat: 'Verben', level: 1 },
  { id: 'v35', sl: 'prinesti', de: 'bringen', cat: 'Verben', level: 2 },
  { id: 'v36', sl: 'najti', de: 'finden', cat: 'Verben', level: 2 },
  { id: 'v37', sl: 'iskati', de: 'suchen', cat: 'Verben', level: 2 },
  { id: 'v38', sl: 'odpreti', de: 'öffnen', cat: 'Verben', level: 2 },
  { id: 'v39', sl: 'zapreti', de: 'schließen', cat: 'Verben', level: 2 },
  { id: 'v40', sl: 'začeti', de: 'beginnen', cat: 'Verben', level: 2 },
  { id: 'v41', sl: 'končati', de: 'beenden', cat: 'Verben', level: 2 },
  { id: 'v42', sl: 'čakati', de: 'warten', cat: 'Verben', level: 1 },
  { id: 'v43', sl: 'pozabiti', de: 'vergessen', cat: 'Verben', level: 2 },
  { id: 'v44', sl: 'spomniti se', de: 'sich erinnern', cat: 'Verben', level: 2 },
  { id: 'v45', sl: 'učiti se', de: 'lernen', cat: 'Verben', level: 1 },
  { id: 'v46', sl: 'igrati', de: 'spielen', cat: 'Verben', level: 1 },
  { id: 'v47', sl: 'potovati', de: 'reisen', cat: 'Verben', level: 2 },
  { id: 'v48', sl: 'voziti', de: 'fahren', cat: 'Verben', level: 2 },
  { id: 'v49', sl: 'leteti', de: 'fliegen', cat: 'Verben', level: 2 },
  { id: 'v50', sl: 'kuhati', de: 'kochen', cat: 'Verben', level: 1 },

  // --- Mehr Adjektive (30) ---
  { id: 'a19', sl: 'dolg', de: 'lang', cat: 'Adjektive', level: 1 },
  { id: 'a20', sl: 'kratek', de: 'kurz', cat: 'Adjektive', level: 1 },
  { id: 'a21', sl: 'debel', de: 'dick', cat: 'Adjektive', level: 2 },
  { id: 'a22', sl: 'tanek', de: 'dünn', cat: 'Adjektive', level: 2 },
  { id: 'a23', sl: 'visok', de: 'hoch / groß', cat: 'Adjektive', level: 1 },
  { id: 'a24', sl: 'nizek', de: 'niedrig', cat: 'Adjektive', level: 2 },
  { id: 'a25', sl: 'težek', de: 'schwer', cat: 'Adjektive', level: 2 },
  { id: 'a26', sl: 'lahek', de: 'leicht', cat: 'Adjektive', level: 2 },
  { id: 'a27', sl: 'močan', de: 'stark', cat: 'Adjektive', level: 2 },
  { id: 'a28', sl: 'šibek', de: 'schwach', cat: 'Adjektive', level: 2 },
  { id: 'a29', sl: 'bogat', de: 'reich', cat: 'Adjektive', level: 2 },
  { id: 'a30', sl: 'reven', de: 'arm', cat: 'Adjektive', level: 2 },
  { id: 'a31', sl: 'temen', de: 'dunkel', cat: 'Adjektive', level: 2 },
  { id: 'a32', sl: 'svetel', de: 'hell', cat: 'Adjektive', level: 2 },
  { id: 'a33', sl: 'glasen', de: 'laut', cat: 'Adjektive', level: 2 },
  { id: 'a34', sl: 'tih', de: 'leise', cat: 'Adjektive', level: 2 },
  { id: 'a35', sl: 'preprost', de: 'einfach', cat: 'Adjektive', level: 2 },
  { id: 'a36', sl: 'težaven', de: 'schwierig', cat: 'Adjektive', level: 2 },
  { id: 'a37', sl: 'pomemben', de: 'wichtig', cat: 'Adjektive', level: 2 },
  { id: 'a38', sl: 'pravilen', de: 'richtig', cat: 'Adjektive', level: 2 },
  { id: 'a39', sl: 'napačen', de: 'falsch', cat: 'Adjektive', level: 2 },
  { id: 'a40', sl: 'prost', de: 'frei', cat: 'Adjektive', level: 2 },
  { id: 'a41', sl: 'poln', de: 'voll', cat: 'Adjektive', level: 1 },
  { id: 'a42', sl: 'prazen', de: 'leer', cat: 'Adjektive', level: 1 },
  { id: 'a43', sl: 'čist', de: 'sauber', cat: 'Adjektive', level: 2 },
  { id: 'a44', sl: 'umazan', de: 'schmutzig', cat: 'Adjektive', level: 2 },
  { id: 'a45', sl: 'odprt', de: 'offen', cat: 'Adjektive', level: 2 },
  { id: 'a46', sl: 'zaprt', de: 'geschlossen', cat: 'Adjektive', level: 2 },
  { id: 'a47', sl: 'nevarno', de: 'gefährlich', cat: 'Adjektive', level: 2 },
  { id: 'a48', sl: 'varno', de: 'sicher', cat: 'Adjektive', level: 2 },

  // --- Mehr Körper (15) ---
  { id: 'k09', sl: 'obraz', de: 'Gesicht', cat: 'Körper', level: 1 },
  { id: 'k10', sl: 'uho', de: 'Ohr', cat: 'Körper', level: 1 },
  { id: 'k11', sl: 'nos', de: 'Nase', cat: 'Körper', level: 1 },
  { id: 'k12', sl: 'usta', de: 'Mund', cat: 'Körper', level: 1 },
  { id: 'k13', sl: 'zob', de: 'Zahn', cat: 'Körper', level: 2 },
  { id: 'k14', sl: 'jezik', de: 'Zunge / Sprache', cat: 'Körper', level: 2 },
  { id: 'k15', sl: 'lasje', de: 'Haare', cat: 'Körper', level: 1 },
  { id: 'k16', sl: 'prst', de: 'Finger', cat: 'Körper', level: 2 },
  { id: 'k17', sl: 'koleno', de: 'Knie', cat: 'Körper', level: 2 },
  { id: 'k18', sl: 'hrbet', de: 'Rücken', cat: 'Körper', level: 2 },
  { id: 'k19', sl: 'trebuh', de: 'Bauch', cat: 'Körper', level: 2 },
  { id: 'k20', sl: 'vrat', de: 'Hals', cat: 'Körper', level: 2 },
  { id: 'k21', sl: 'rama', de: 'Schulter', cat: 'Körper', level: 2 },
  { id: 'k22', sl: 'koža', de: 'Haut', cat: 'Körper', level: 2 },
  { id: 'k23', sl: 'kri', de: 'Blut', cat: 'Körper', level: 2 },

  // --- Kleidung (16) ---
  { id: 'cl01', sl: 'oblačila', de: 'Kleidung', cat: 'Kleidung', level: 1 },
  { id: 'cl02', sl: 'srajca', de: 'Hemd', cat: 'Kleidung', level: 1 },
  { id: 'cl03', sl: 'majica', de: 'T-Shirt', cat: 'Kleidung', level: 1 },
  { id: 'cl04', sl: 'hlače', de: 'Hose', cat: 'Kleidung', level: 1 },
  { id: 'cl05', sl: 'krilo', de: 'Rock', cat: 'Kleidung', level: 2 },
  { id: 'cl06', sl: 'obleka', de: 'Kleid', cat: 'Kleidung', level: 1 },
  { id: 'cl07', sl: 'čevlji', de: 'Schuhe', cat: 'Kleidung', level: 1 },
  { id: 'cl08', sl: 'nogavice', de: 'Socken', cat: 'Kleidung', level: 2 },
  { id: 'cl09', sl: 'jakna', de: 'Jacke', cat: 'Kleidung', level: 1 },
  { id: 'cl10', sl: 'plašč', de: 'Mantel', cat: 'Kleidung', level: 2 },
  { id: 'cl11', sl: 'kapa', de: 'Mütze', cat: 'Kleidung', level: 1 },
  { id: 'cl12', sl: 'klobuk', de: 'Hut', cat: 'Kleidung', level: 2 },
  { id: 'cl13', sl: 'rokavice', de: 'Handschuhe', cat: 'Kleidung', level: 2 },
  { id: 'cl14', sl: 'pas', de: 'Gürtel', cat: 'Kleidung', level: 2 },
  { id: 'cl15', sl: 'torba', de: 'Tasche', cat: 'Kleidung', level: 1 },
  { id: 'cl16', sl: 'dežnik', de: 'Regenschirm', cat: 'Kleidung', level: 2 },

  // --- Tiere (22) ---
  { id: 'an01', sl: 'žival', de: 'Tier', cat: 'Tiere', level: 1 },
  { id: 'an02', sl: 'krava', de: 'Kuh', cat: 'Tiere', level: 1 },
  { id: 'an03', sl: 'konj', de: 'Pferd', cat: 'Tiere', level: 1 },
  { id: 'an04', sl: 'prašič', de: 'Schwein', cat: 'Tiere', level: 2 },
  { id: 'an05', sl: 'ovca', de: 'Schaf', cat: 'Tiere', level: 2 },
  { id: 'an06', sl: 'koza', de: 'Ziege', cat: 'Tiere', level: 2 },
  { id: 'an07', sl: 'kokoš', de: 'Huhn', cat: 'Tiere', level: 2 },
  { id: 'an08', sl: 'raca', de: 'Ente', cat: 'Tiere', level: 2 },
  { id: 'an09', sl: 'ptica', de: 'Vogel', cat: 'Tiere', level: 1 },
  { id: 'an10', sl: 'miš', de: 'Maus', cat: 'Tiere', level: 2 },
  { id: 'an11', sl: 'kunec', de: 'Kaninchen', cat: 'Tiere', level: 2 },
  { id: 'an12', sl: 'lisica', de: 'Fuchs', cat: 'Tiere', level: 2 },
  { id: 'an13', sl: 'medved', de: 'Bär', cat: 'Tiere', level: 2 },
  { id: 'an14', sl: 'volk', de: 'Wolf', cat: 'Tiere', level: 2 },
  { id: 'an15', sl: 'jelen', de: 'Hirsch', cat: 'Tiere', level: 2 },
  { id: 'an16', sl: 'žaba', de: 'Frosch', cat: 'Tiere', level: 2 },
  { id: 'an17', sl: 'kača', de: 'Schlange', cat: 'Tiere', level: 2 },
  { id: 'an18', sl: 'pajek', de: 'Spinne', cat: 'Tiere', level: 2 },
  { id: 'an19', sl: 'muha', de: 'Fliege', cat: 'Tiere', level: 2 },
  { id: 'an20', sl: 'čebela', de: 'Biene', cat: 'Tiere', level: 2 },
  { id: 'an21', sl: 'metulj', de: 'Schmetterling', cat: 'Tiere', level: 2 },
  { id: 'an22', sl: 'mravlja', de: 'Ameise', cat: 'Tiere', level: 2 },

  // --- Transport (12) ---
  { id: 'tr01', sl: 'vlak', de: 'Zug', cat: 'Transport', level: 1 },
  { id: 'tr02', sl: 'avtobus', de: 'Bus', cat: 'Transport', level: 1 },
  { id: 'tr03', sl: 'letalo', de: 'Flugzeug', cat: 'Transport', level: 1 },
  { id: 'tr04', sl: 'ladja', de: 'Schiff', cat: 'Transport', level: 2 },
  { id: 'tr05', sl: 'kolo', de: 'Fahrrad', cat: 'Transport', level: 1 },
  { id: 'tr06', sl: 'motor', de: 'Motorrad', cat: 'Transport', level: 2 },
  { id: 'tr07', sl: 'taksi', de: 'Taxi', cat: 'Transport', level: 1 },
  { id: 'tr08', sl: 'postaja', de: 'Bahnhof', cat: 'Transport', level: 2 },
  { id: 'tr09', sl: 'letališče', de: 'Flughafen', cat: 'Transport', level: 2 },
  { id: 'tr10', sl: 'vozovnica', de: 'Ticket', cat: 'Transport', level: 2 },
  { id: 'tr11', sl: 'cesta', de: 'Straße', cat: 'Transport', level: 1 },
  { id: 'tr12', sl: 'most', de: 'Brücke', cat: 'Transport', level: 2 },

  // --- Berufe (15) ---
  { id: 'j01', sl: 'učitelj', de: 'Lehrer', cat: 'Berufe', level: 1 },
  { id: 'j02', sl: 'policist', de: 'Polizist', cat: 'Berufe', level: 2 },
  { id: 'j03', sl: 'kuhar', de: 'Koch', cat: 'Berufe', level: 2 },
  { id: 'j04', sl: 'natakar', de: 'Kellner', cat: 'Berufe', level: 2 },
  { id: 'j05', sl: 'prodajalec', de: 'Verkäufer', cat: 'Berufe', level: 2 },
  { id: 'j06', sl: 'študent', de: 'Student', cat: 'Berufe', level: 1 },
  { id: 'j07', sl: 'delavec', de: 'Arbeiter', cat: 'Berufe', level: 2 },
  { id: 'j08', sl: 'inženir', de: 'Ingenieur', cat: 'Berufe', level: 2 },
  { id: 'j09', sl: 'voznik', de: 'Fahrer', cat: 'Berufe', level: 2 },
  { id: 'j10', sl: 'umetnik', de: 'Künstler', cat: 'Berufe', level: 2 },
  { id: 'j11', sl: 'pisatelj', de: 'Schriftsteller', cat: 'Berufe', level: 2 },
  { id: 'j12', sl: 'glasbenik', de: 'Musiker', cat: 'Berufe', level: 2 },
  { id: 'j13', sl: 'frizer', de: 'Friseur', cat: 'Berufe', level: 2 },
  { id: 'j14', sl: 'gasilec', de: 'Feuerwehrmann', cat: 'Berufe', level: 2 },
  { id: 'j15', sl: 'medicinska sestra', de: 'Krankenschwester', cat: 'Berufe', level: 2 },

  // --- Hobbys & Aktivitäten (15) ---
  { id: 'h01', sl: 'šport', de: 'Sport', cat: 'Hobbys', level: 1 },
  { id: 'h02', sl: 'nogomet', de: 'Fußball', cat: 'Hobbys', level: 1 },
  { id: 'h03', sl: 'košarka', de: 'Basketball', cat: 'Hobbys', level: 2 },
  { id: 'h04', sl: 'tenis', de: 'Tennis', cat: 'Hobbys', level: 2 },
  { id: 'h05', sl: 'plavanje', de: 'Schwimmen', cat: 'Hobbys', level: 2 },
  { id: 'h06', sl: 'kolesarjenje', de: 'Radfahren', cat: 'Hobbys', level: 2 },
  { id: 'h07', sl: 'fotografija', de: 'Fotografie', cat: 'Hobbys', level: 2 },
  { id: 'h08', sl: 'kuhanje', de: 'Kochen', cat: 'Hobbys', level: 2 },
  { id: 'h09', sl: 'branje', de: 'Lesen', cat: 'Hobbys', level: 2 },
  { id: 'h10', sl: 'potovanje', de: 'Reisen', cat: 'Hobbys', level: 2 },
  { id: 'h11', sl: 'ples', de: 'Tanz', cat: 'Hobbys', level: 2 },
  { id: 'h12', sl: 'koncert', de: 'Konzert', cat: 'Hobbys', level: 1 },
  { id: 'h13', sl: 'muzej', de: 'Museum', cat: 'Hobbys', level: 2 },
  { id: 'h14', sl: 'izlet', de: 'Ausflug', cat: 'Hobbys', level: 2 },
  { id: 'h15', sl: 'zabava', de: 'Party', cat: 'Hobbys', level: 1 },

  // --- Emotionen (12) ---
  { id: 'em01', sl: 'jezen', de: 'wütend', cat: 'Emotionen', level: 2 },
  { id: 'em02', sl: 'srečen', de: 'glücklich', cat: 'Emotionen', level: 1 },
  { id: 'em03', sl: 'zaljubljen', de: 'verliebt', cat: 'Emotionen', level: 2 },
  { id: 'em04', sl: 'presenečen', de: 'überrascht', cat: 'Emotionen', level: 2 },
  { id: 'em05', sl: 'strah', de: 'Angst', cat: 'Emotionen', level: 2 },
  { id: 'em06', sl: 'upanje', de: 'Hoffnung', cat: 'Emotionen', level: 2 },
  { id: 'em07', sl: 'jeza', de: 'Wut', cat: 'Emotionen', level: 2 },
  { id: 'em08', sl: 'veselje', de: 'Freude', cat: 'Emotionen', level: 2 },
  { id: 'em09', sl: 'dolgčas', de: 'Langeweile', cat: 'Emotionen', level: 2 },
  { id: 'em10', sl: 'pogum', de: 'Mut', cat: 'Emotionen', level: 2 },
  { id: 'em11', sl: 'ponos', de: 'Stolz', cat: 'Emotionen', level: 2 },
  { id: 'em12', sl: 'sram', de: 'Scham', cat: 'Emotionen', level: 2 },

  // --- Haus & Räume (12) ---
  { id: 'ho01', sl: 'soba', de: 'Zimmer', cat: 'Haus', level: 1 },
  { id: 'ho02', sl: 'kuhinja', de: 'Küche', cat: 'Haus', level: 1 },
  { id: 'ho03', sl: 'kopalnica', de: 'Badezimmer', cat: 'Haus', level: 1 },
  { id: 'ho04', sl: 'spalnica', de: 'Schlafzimmer', cat: 'Haus', level: 1 },
  { id: 'ho05', sl: 'dnevna soba', de: 'Wohnzimmer', cat: 'Haus', level: 2 },
  { id: 'ho06', sl: 'stranišče', de: 'Toilette', cat: 'Haus', level: 2 },
  { id: 'ho07', sl: 'hodnik', de: 'Flur', cat: 'Haus', level: 2 },
  { id: 'ho08', sl: 'balkon', de: 'Balkon', cat: 'Haus', level: 1 },
  { id: 'ho09', sl: 'vrt', de: 'Garten', cat: 'Haus', level: 1 },
  { id: 'ho10', sl: 'streha', de: 'Dach', cat: 'Haus', level: 2 },
  { id: 'ho11', sl: 'klet', de: 'Keller', cat: 'Haus', level: 2 },
  { id: 'ho12', sl: 'stanovanje', de: 'Wohnung', cat: 'Haus', level: 1 },

  // --- Technologie (10) ---
  { id: 'te01', sl: 'računalnik', de: 'Computer', cat: 'Technologie', level: 1 },
  { id: 'te02', sl: 'internet', de: 'Internet', cat: 'Technologie', level: 1 },
  { id: 'te03', sl: 'spletna stran', de: 'Webseite', cat: 'Technologie', level: 2 },
  { id: 'te04', sl: 'elektronska pošta', de: 'E-Mail', cat: 'Technologie', level: 2 },
  { id: 'te05', sl: 'sporočilo', de: 'Nachricht', cat: 'Technologie', level: 1 },
  { id: 'te06', sl: 'fotoaparat', de: 'Kamera', cat: 'Technologie', level: 2 },
  { id: 'te07', sl: 'ekran', de: 'Bildschirm', cat: 'Technologie', level: 2 },
  { id: 'te08', sl: 'tipkovnica', de: 'Tastatur', cat: 'Technologie', level: 2 },
  { id: 'te09', sl: 'aplikacija', de: 'App', cat: 'Technologie', level: 1 },
  { id: 'te10', sl: 'geslo', de: 'Passwort', cat: 'Technologie', level: 1 },

  // --- Mehr Zahlen (8) ---
  { id: 'z16', sl: 'enajst', de: 'elf', cat: 'Zahlen', level: 2 },
  { id: 'z17', sl: 'dvanajst', de: 'zwölf', cat: 'Zahlen', level: 2 },
  { id: 'z18', sl: 'petnajst', de: 'fünfzehn', cat: 'Zahlen', level: 2 },
  { id: 'z19', sl: 'štirideset', de: 'vierzig', cat: 'Zahlen', level: 2 },
  { id: 'z20', sl: 'petdeset', de: 'fünfzig', cat: 'Zahlen', level: 2 },
  { id: 'z21', sl: 'milijon', de: 'Million', cat: 'Zahlen', level: 2 },
  { id: 'z22', sl: 'prvi', de: 'erste(r)', cat: 'Zahlen', level: 2 },
  { id: 'z23', sl: 'drugi', de: 'zweite(r)', cat: 'Zahlen', level: 2 },

  // --- Mehr Farben (6) ---
  { id: 'c09', sl: 'roza', de: 'rosa', cat: 'Farben', level: 2 },
  { id: 'c10', sl: 'vijolična', de: 'lila', cat: 'Farben', level: 2 },
  { id: 'c11', sl: 'siva', de: 'grau', cat: 'Farben', level: 2 },
  { id: 'c12', sl: 'zlata', de: 'gold', cat: 'Farben', level: 2 },
  { id: 'c13', sl: 'srebrna', de: 'silber', cat: 'Farben', level: 2 },
  { id: 'c14', sl: 'temna', de: 'dunkel', cat: 'Farben', level: 2 },

  // --- Mehr Orte (12) ---
  { id: 'o13', sl: 'park', de: 'Park', cat: 'Orte', level: 1 },
  { id: 'o14', sl: 'trg', de: 'Platz', cat: 'Orte', level: 2 },
  { id: 'o15', sl: 'ulica', de: 'Straße', cat: 'Orte', level: 1 },
  { id: 'o16', sl: 'restavracija', de: 'Restaurant', cat: 'Orte', level: 1 },
  { id: 'o17', sl: 'kavarna', de: 'Café', cat: 'Orte', level: 1 },
  { id: 'o18', sl: 'bar', de: 'Bar', cat: 'Orte', level: 1 },
  { id: 'o19', sl: 'hotel', de: 'Hotel', cat: 'Orte', level: 1 },
  { id: 'o20', sl: 'banka', de: 'Bank', cat: 'Orte', level: 1 },
  { id: 'o21', sl: 'pošta', de: 'Post', cat: 'Orte', level: 2 },
  { id: 'o22', sl: 'bolnišnica', de: 'Krankenhaus', cat: 'Orte', level: 2 },
  { id: 'o23', sl: 'cerkev', de: 'Kirche', cat: 'Orte', level: 2 },
  { id: 'o24', sl: 'knjižnica', de: 'Bibliothek', cat: 'Orte', level: 2 },

  // --- Mehr Alltag (10) ---
  { id: 'd16', sl: 'voda (flasche)', de: 'Flasche Wasser', cat: 'Alltag', level: 1 },
  { id: 'd17', sl: 'papir', de: 'Papier', cat: 'Alltag', level: 2 },
  { id: 'd18', sl: 'pismo', de: 'Brief', cat: 'Alltag', level: 2 },
  { id: 'd19', sl: 'darilo', de: 'Geschenk', cat: 'Alltag', level: 1 },
  { id: 'd20', sl: 'cvetje', de: 'Blumen', cat: 'Alltag', level: 2 },
  { id: 'd21', sl: 'fotografija', de: 'Foto', cat: 'Alltag', level: 2 },
  { id: 'd22', sl: 'zemljevid', de: 'Landkarte', cat: 'Alltag', level: 2 },
  { id: 'd23', sl: 'koledar', de: 'Kalender', cat: 'Alltag', level: 2 },
  { id: 'd24', sl: 'časopis', de: 'Zeitung', cat: 'Alltag', level: 2 },
  { id: 'd25', sl: 'svinčnik', de: 'Bleistift', cat: 'Alltag', level: 2 },

  // --- Mehr Familie (5) ---
  { id: 'f13', sl: 'sin', de: 'Sohn', cat: 'Familie', level: 1 },
  { id: 'f14', sl: 'hči', de: 'Tochter', cat: 'Familie', level: 1 },
  { id: 'f15', sl: 'mož', de: 'Ehemann', cat: 'Familie', level: 2 },
  { id: 'f16', sl: 'žena', de: 'Ehefrau', cat: 'Familie', level: 2 },
  { id: 'f17', sl: 'starši', de: 'Eltern', cat: 'Familie', level: 1 },

  // --- Mehr Sätze (15) ---
  { id: 's26', sl: 'Želim ti srečo', de: 'Ich wünsche dir Glück', cat: 'Sätze', level: 2 },
  { id: 's27', sl: 'Hvala za vse', de: 'Danke für alles', cat: 'Sätze', level: 2 },
  { id: 's28', sl: 'Pokliči me', de: 'Ruf mich an', cat: 'Sätze', level: 2 },
  { id: 's29', sl: 'Kje si?', de: 'Wo bist du?', cat: 'Sätze', level: 1 },
  { id: 's30', sl: 'Kaj delaš?', de: 'Was machst du?', cat: 'Sätze', level: 1 },
  { id: 's31', sl: 'Kaj je to?', de: 'Was ist das?', cat: 'Sätze', level: 1 },
  { id: 's32', sl: 'Koliko si star?', de: 'Wie alt bist du?', cat: 'Sätze', level: 1 },
  { id: 's33', sl: 'Imam 20 let', de: 'Ich bin 20 Jahre alt', cat: 'Sätze', level: 2 },
  { id: 's34', sl: 'Lepo te je videti', de: 'Schön dich zu sehen', cat: 'Sätze', level: 2 },
  { id: 's35', sl: 'Veselim se', de: 'Ich freue mich', cat: 'Sätze', level: 2 },
  { id: 's36', sl: 'Pridi sem!', de: 'Komm her!', cat: 'Sätze', level: 1 },
  { id: 's37', sl: 'Pojdimo!', de: 'Lass uns gehen!', cat: 'Sätze', level: 1 },
  { id: 's38', sl: 'Danes je lep dan', de: 'Heute ist ein schöner Tag', cat: 'Sätze', level: 2 },
  { id: 's39', sl: 'Prosim, počasneje', de: 'Bitte langsamer', cat: 'Sätze', level: 2 },
  { id: 's40', sl: 'Vse v redu?', de: 'Alles in Ordnung?', cat: 'Sätze', level: 1 },

  // --- Mehr Begrüßung (4) ---
  { id: 'b17', sl: 'Čestitam!', de: 'Glückwunsch!', cat: 'Begrüßung', level: 2 },
  { id: 'b18', sl: 'Pozdrav', de: 'Grüße', cat: 'Begrüßung', level: 2 },
  { id: 'b19', sl: 'Lep pozdrav', de: 'Herzliche Grüße', cat: 'Begrüßung', level: 2 },
  { id: 'b20', sl: 'Z veseljem', de: 'Mit Vergnügen', cat: 'Begrüßung', level: 2 },

  // --- Mehr Wetter (8) ---
  { id: 'w11', sl: 'dežuje', de: 'es regnet', cat: 'Wetter', level: 1 },
  { id: 'w12', sl: 'sneži', de: 'es schneit', cat: 'Wetter', level: 1 },
  { id: 'w13', sl: 'megla', de: 'Nebel', cat: 'Wetter', level: 2 },
  { id: 'w14', sl: 'nevihta', de: 'Gewitter', cat: 'Wetter', level: 2 },
  { id: 'w15', sl: 'mraz', de: 'Kälte', cat: 'Wetter', level: 2 },
  { id: 'w16', sl: 'toplota', de: 'Wärme', cat: 'Wetter', level: 2 },
  { id: 'w17', sl: 'pomlad', de: 'Frühling', cat: 'Wetter', level: 1 },
  { id: 'w18', sl: 'poletje', de: 'Sommer', cat: 'Wetter', level: 1 },

  // --- Jahreszeiten & Natur (6) ---
  { id: 'n01', sl: 'jesen', de: 'Herbst', cat: 'Wetter', level: 1 },
  { id: 'n02', sl: 'zima', de: 'Winter', cat: 'Wetter', level: 1 },
  { id: 'n03', sl: 'trava', de: 'Gras', cat: 'Wetter', level: 2 },
  { id: 'n04', sl: 'list', de: 'Blatt', cat: 'Wetter', level: 2 },
  { id: 'n05', sl: 'zvezda', de: 'Stern', cat: 'Wetter', level: 2 },
  { id: 'n06', sl: 'luna', de: 'Mond', cat: 'Wetter', level: 2 },
]

// ============================================================
// KONSTANTEN
// ============================================================
const COLORS = {
  bg: '#0c1222',
  bgGradient: 'linear-gradient(180deg, #0c1222 0%, #0f172a 100%)',
  surface: '#1e293b',
  surfaceLight: '#334155',
  accent: '#059669',
  accentLight: '#34d399',
  accentGlow: 'rgba(52, 211, 153, 0.15)',
  gold: '#fbbf24',
  goldGlow: 'rgba(251, 191, 36, 0.2)',
  danger: '#ef4444',
  dangerGlow: 'rgba(239, 68, 68, 0.15)',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
}

const LEITNER_INTERVALS = [0, 1, 3, 7, 14, 30]
const XP_PER_LEVEL = 100
const DAILY_GOAL = 15
const SESSION_SIZE = 10
const QUIZ_SIZE = 10
const EMOJI_QUIZ_SIZE = 10

// ============================================================
// EMOJI-MAPPING für Bilder-Quiz (visueller Lerntyp)
// ============================================================
const EMOJIS = {
  // Begrüßung
  b01: '🌞', b02: '👋', b03: '🙏', b08: '🌅', b09: '🌆', b10: '🌙', b17: '🎉',
  // Zahlen
  z01: '1️⃣', z02: '2️⃣', z03: '3️⃣', z04: '4️⃣', z05: '5️⃣', z06: '6️⃣', z07: '7️⃣', z08: '8️⃣', z09: '9️⃣', z10: '🔟',
  z11: '2️⃣0️⃣', z13: '💯', z15: '0️⃣',
  // Essen & Trinken
  e01: '💧', e02: '🍞', e03: '🥛', e04: '☕', e05: '🍵', e06: '🍺', e07: '🍷', e08: '🍎', e09: '🧀', e10: '🥩',
  e11: '🥗', e12: '🍲', e13: '🍦', e14: '🍊', e15: '🍌', e16: '🍇', e17: '🥦', e18: '🐟', e19: '🍚', e20: '🍝',
  e21: '🥔', e22: '🍅', e23: '🥒', e24: '🌶️', e25: '🧅', e26: '🧄', e27: '🧂', e29: '🍬', e30: '🧈', e31: '🫒',
  e32: '🍯', e33: '🍓', e34: '🥚', e35: '🍗', e36: '🐖', e37: '🐄', e38: '🌭', e39: '🍫', e40: '🎂', e41: '🍪',
  e42: '🧃', e43: '🥤', e44: '🥐', e45: '🍽️', e46: '🌃',
  // Familie
  f01: '👩', f02: '👨', f03: '👦', f04: '👧', f05: '🤝', f06: '🧒', f07: '👵', f08: '👴', f09: '👨‍👩‍👧‍👦',
  f11: '🧑', f12: '👩‍🦱', f13: '👦', f14: '👧', f15: '🤵', f16: '👰', f17: '👫',
  // Orte
  o01: '🏠', o02: '🏫', o03: '🏙️', o04: '🏰', o05: '🇸🇮', o06: '⛰️', o07: '🌊', o08: '🏞️', o09: '🏞️', o10: '🌲',
  o11: '🏖️', o12: '🏪', o13: '🌳', o15: '🛣️', o16: '🍽️', o17: '☕', o18: '🍸', o19: '🏨', o20: '🏦', o21: '📮',
  o22: '🏥', o23: '⛪', o24: '📚',
  // Farben
  c01: '🔴', c02: '🔵', c03: '🟢', c04: '⚪', c05: '⚫', c06: '🟡', c07: '🟠', c08: '🟤', c09: '🌸', c10: '🟣',
  c11: '🔘', c12: '🥇', c13: '🥈',
  // Körper
  k01: '🧠', k02: '🖐️', k03: '🦵', k04: '👀', k05: '❤️', k06: '👨‍⚕️', k07: '💊', k08: '🤒', k09: '😀', k10: '👂',
  k11: '👃', k12: '👄', k13: '🦷', k14: '👅', k15: '💇', k16: '☝️', k17: '🦵', k22: '🧴', k23: '🩸',
  // Zeit
  t01: '📅', t02: '⏭️', t03: '⏮️', t04: '1️⃣', t14: '🕐', t15: '⏰',
  // Pronomen (wenige)
  p01: '🙋', p02: '👉',
  // Verben
  v03: '🚶', v04: '🏃', v05: '👀', v06: '👂', v07: '💬', v11: '🍴', v12: '🥤', v13: '😴', v14: '💼', v16: '💕',
  v19: '🛒', v20: '🤝', v21: '✍️', v22: '📖', v25: '🏊', v26: '💃', v27: '🎤', v28: '😂', v29: '😢', v30: '❓',
  v33: '✋', v34: '🎁', v38: '🚪', v40: '🏁', v46: '🎮', v47: '✈️', v48: '🚗', v49: '🛫', v50: '👨‍🍳',
  // Adjektive (nur klare)
  a01: '👍', a02: '👎', a03: '🐘', a04: '🐁', a05: '😍', a07: '✨', a08: '👴', a09: '⚡', a10: '🐢', a11: '🔥',
  a12: '🧊', a13: '🌶️', a14: '😋', a15: '💧', a16: '😴', a17: '😄', a18: '😢', a19: '📏', a23: '🗻', a25: '🏋️',
  a27: '💪', a29: '💰', a31: '🌑', a32: '💡', a33: '📢', a34: '🤫', a41: '🍷', a42: '🥛',
  // Alltag
  d01: '💰', d02: '🚗', d03: '📱', d04: '📖', d05: '🔑', d06: '🚪', d07: '🪟', d08: '🪑', d09: '💺', d10: '🛏️',
  d11: '💼', d13: '🎵', d14: '🎬', d15: '🎲', d18: '✉️', d19: '🎁', d20: '💐', d21: '📸', d22: '🗺️', d23: '📅',
  d24: '📰', d25: '✏️',
  // Wetter & Natur
  w01: '☀️', w02: '🌧️', w03: '❄️', w04: '💨', w05: '☁️', w06: '🌌', w07: '🌳', w08: '🌸', w09: '🐕', w10: '🐈',
  w11: '🌧️', w12: '🌨️', w13: '🌫️', w14: '⛈️', w15: '🥶', w16: '🌡️', w17: '🌷', w18: '☀️',
  n01: '🍂', n02: '⛄', n03: '🌱', n04: '🍃', n05: '⭐', n06: '🌙',
  // Richtungen
  r01: '⬅️', r02: '➡️', r03: '⬆️', r04: '⬇️', r05: '🔼', r06: '📍',
  // Kleidung
  cl01: '👕', cl02: '👔', cl03: '👕', cl04: '👖', cl05: '👗', cl06: '👗', cl07: '👟', cl08: '🧦', cl09: '🧥',
  cl10: '🧥', cl11: '🧢', cl12: '🎩', cl13: '🧤', cl14: '🎗️', cl15: '👜', cl16: '☂️',
  // Tiere
  an01: '🐾', an02: '🐄', an03: '🐴', an04: '🐖', an05: '🐑', an06: '🐐', an07: '🐔', an08: '🦆', an09: '🐦',
  an10: '🐁', an11: '🐇', an12: '🦊', an13: '🐻', an14: '🐺', an15: '🦌', an16: '🐸', an17: '🐍', an18: '🕷️',
  an19: '🪰', an20: '🐝', an21: '🦋', an22: '🐜',
  // Transport
  tr01: '🚂', tr02: '🚌', tr03: '✈️', tr04: '🚢', tr05: '🚲', tr06: '🏍️', tr07: '🚕', tr08: '🚉', tr09: '🛫',
  tr10: '🎫', tr11: '🛣️', tr12: '🌉',
  // Berufe
  j01: '👨‍🏫', j02: '👮', j03: '👨‍🍳', j04: '🤵', j05: '💁', j06: '🎓', j07: '👷', j08: '👨‍💻', j09: '🚗',
  j10: '🎨', j11: '✍️', j12: '🎸', j13: '💇', j14: '🧑‍🚒', j15: '👩‍⚕️',
  // Hobbys
  h01: '🏅', h02: '⚽', h03: '🏀', h04: '🎾', h05: '🏊', h06: '🚴', h07: '📷', h08: '👨‍🍳', h09: '📖', h10: '✈️',
  h11: '💃', h12: '🎤', h13: '🏛️', h14: '🎒', h15: '🎉',
  // Emotionen
  em01: '😠', em02: '😄', em03: '😍', em04: '😲', em05: '😨', em06: '🌟', em07: '😡', em08: '🥳', em09: '😑',
  em10: '🦁', em11: '😤', em12: '😳',
  // Haus
  ho01: '🚪', ho02: '🍳', ho03: '🛁', ho04: '🛏️', ho05: '🛋️', ho06: '🚽', ho07: '🚶', ho08: '🏢', ho09: '🌻',
  ho10: '🏠', ho11: '⬇️', ho12: '🏢',
  // Technologie
  te01: '💻', te02: '🌐', te03: '🔗', te04: '📧', te05: '💬', te06: '📷', te07: '🖥️', te08: '⌨️', te09: '📱',
  te10: '🔒',
}

const CAT_ICONS = {
  'Begrüßung': '👋',
  'Zahlen': '🔢',
  'Essen & Trinken': '🍽️',
  'Familie': '👨‍👩‍👧‍👦',
  'Orte': '📍',
  'Sätze': '💬',
  'Farben': '🎨',
  'Körper': '🧍',
  'Zeit': '🕐',
  'Pronomen': '👤',
  'Fragewörter': '❓',
  'Verben': '⚡',
  'Adjektive': '✨',
  'Alltag': '🏠',
  'Wetter': '☀️',
  'Richtungen': '🧭',
  'Kleidung': '👕',
  'Tiere': '🐾',
  'Transport': '🚗',
  'Berufe': '💼',
  'Hobbys': '⚽',
  'Emotionen': '❤️',
  'Haus': '🏡',
  'Technologie': '💻',
}

// ============================================================
// HELPER FUNKTIONEN
// ============================================================
function getToday() {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'sl-SI'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function getDueCards(srsData) {
  const today = getToday()
  return VOCAB.filter(card => {
    const data = srsData[card.id]
    if (!data) return true // new card = due
    if (data.box >= 5 && data.lastReview) {
      const due = addDays(data.lastReview, LEITNER_INTERVALS[5])
      return due <= today
    }
    if (data.lastReview) {
      const due = addDays(data.lastReview, LEITNER_INTERVALS[data.box] || 0)
      return due <= today
    }
    return true
  })
}

function getSessionCards(srsData) {
  const due = getDueCards(srsData)
  // sort by box (lower first = higher priority)
  due.sort((a, b) => {
    const boxA = srsData[a.id]?.box ?? 0
    const boxB = srsData[b.id]?.box ?? 0
    return boxA - boxB
  })
  return due.slice(0, SESSION_SIZE)
}

// ============================================================
// STYLES
// ============================================================
const S = {
  screen: {
    minHeight: '100dvh',
    background: COLORS.bgGradient,
    padding: 'max(env(safe-area-inset-top, 20px), 54px) max(env(safe-area-inset-right, 16px), 16px) max(env(safe-area-inset-bottom, 20px), 20px) max(env(safe-area-inset-left, 16px), 16px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  btn: {
    minHeight: '48px',
    padding: '12px 24px',
    borderRadius: '14px',
    fontWeight: '600',
    fontSize: 'clamp(15px, 3.8vw, 17px)',
    touchAction: 'manipulation',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
    color: '#fff',
    boxShadow: `0 4px 15px ${COLORS.accentGlow}`,
  },
  btnSecondary: {
    background: COLORS.surface,
    color: COLORS.text,
    border: `1px solid ${COLORS.surfaceLight}`,
  },
  btnDanger: {
    background: `linear-gradient(135deg, ${COLORS.danger}, #f87171)`,
    color: '#fff',
    boxShadow: `0 4px 15px ${COLORS.dangerGlow}`,
  },
  card: {
    background: COLORS.surface,
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    border: `1px solid rgba(255,255,255,0.05)`,
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: `2px solid ${COLORS.surfaceLight}`,
    background: COLORS.surface,
    color: COLORS.text,
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  title: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    fontWeight: '800',
    background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.gold})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.textMuted,
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px 0',
    touchAction: 'manipulation',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}

// ============================================================
// APP COMPONENT
// ============================================================
export default function App() {
  const [screen, setScreen] = useState('loading')
  const [player, setPlayer] = useState(null)
  const [error, setError] = useState('')

  // Onboarding
  const [authMode, setAuthMode] = useState('choose') // 'choose', 'register', 'login'
  const [nameInput, setNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameLoading, setNameLoading] = useState(false)

  // Flashcards
  const [sessionCards, setSessionCards] = useState([])
  const [sessionIndex, setSessionIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, xpEarned: 0 })
  const [repeatQueue, setRepeatQueue] = useState([])
  const [srsChanges, setSrsChanges] = useState({})

  // Quiz
  const [quizCards, setQuizCards] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizOptions, setQuizOptions] = useState([])
  const [quizAnswered, setQuizAnswered] = useState(null)
  const [quizStats, setQuizStats] = useState({ correct: 0, wrong: 0, xpEarned: 0 })

  // Emoji-Quiz (Bilder-Quiz)
  const [emojiQuizCards, setEmojiQuizCards] = useState([])
  const [emojiQuizIndex, setEmojiQuizIndex] = useState(0)
  const [emojiQuizOptions, setEmojiQuizOptions] = useState([])
  const [emojiQuizAnswered, setEmojiQuizAnswered] = useState(null)
  const [emojiQuizStats, setEmojiQuizStats] = useState({ correct: 0, wrong: 0, xpEarned: 0 })

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([])
  const [lbLoading, setLbLoading] = useState(false)

  // Level-up
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(0)

  // --------------------------------------------------------
  // INIT: Load player from localStorage / Supabase
  // --------------------------------------------------------
  useEffect(() => {
    async function init() {
      const playerId = localStorage.getItem('slovensko_player_id')
      if (!playerId) {
        setScreen('onboarding')
        return
      }
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single()
        if (error || !data) {
          localStorage.removeItem('slovensko_player_id')
          setScreen('onboarding')
          return
        }
        // Day rollover
        const today = getToday()
        let updates = {}
        if (data.today_date !== today) {
          updates.today_reviewed = 0
          updates.today_date = today
          // Streak logic
          if (data.streak_last_date) {
            const diff = daysBetween(data.streak_last_date, today)
            if (diff > 1) {
              updates.streak_count = 0
            }
          }
        }
        if (Object.keys(updates).length > 0) {
          const { data: updated } = await supabase
            .from('players')
            .update(updates)
            .eq('id', playerId)
            .select()
            .single()
          setPlayer(updated || { ...data, ...updates })
        } else {
          setPlayer(data)
        }
        setScreen('home')
      } catch {
        setScreen('onboarding')
      }
    }
    init()
  }, [])

  // --------------------------------------------------------
  // SYNC player to Supabase
  // --------------------------------------------------------
  const syncPlayer = useCallback(async (updates) => {
    if (!player) return player
    const oldLevel = Math.floor(player.xp / XP_PER_LEVEL)
    const merged = { ...player, ...updates }
    const newLvl = Math.floor(merged.xp / XP_PER_LEVEL)
    setPlayer(merged)
    if (newLvl > oldLevel) {
      setNewLevel(newLvl)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 2500)
    }
    try {
      await supabase
        .from('players')
        .update(updates)
        .eq('id', player.id)
    } catch { /* ignore */ }
    return merged
  }, [player])

  // --------------------------------------------------------
  // ONBOARDING
  // --------------------------------------------------------
  async function handleRegister() {
    const name = nameInput.trim()
    const password = passwordInput
    if (name.length < 2) { setNameError('Name: mindestens 2 Zeichen'); return }
    if (name.length > 20) { setNameError('Name: maximal 20 Zeichen'); return }
    if (password.length < 4) { setNameError('Passwort: mindestens 4 Zeichen'); return }
    setNameLoading(true)
    setNameError('')
    try {
      const { data: existing } = await supabase
        .from('players')
        .select('id')
        .eq('name', name)
        .maybeSingle()
      if (existing) {
        setNameError('Name ist bereits vergeben')
        setNameLoading(false)
        return
      }
      const today = getToday()
      const { data, error } = await supabase
        .from('players')
        .insert({
          name,
          password,
          xp: 0,
          streak_count: 0,
          streak_last_date: null,
          srs_data: {},
          today_reviewed: 0,
          today_date: today,
        })
        .select()
        .single()
      if (error) throw error
      localStorage.setItem('slovensko_player_id', data.id)
      setPlayer(data)
      setScreen('home')
    } catch (e) {
      setNameError('Fehler bei der Registrierung. Versuche es erneut.')
    }
    setNameLoading(false)
  }

  async function handleLogin() {
    const name = nameInput.trim()
    const password = passwordInput
    if (!name || !password) { setNameError('Name und Passwort eingeben'); return }
    setNameLoading(true)
    setNameError('')
    try {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('name', name)
        .eq('password', password)
        .maybeSingle()
      if (!data) {
        setNameError('Name oder Passwort falsch')
        setNameLoading(false)
        return
      }
      localStorage.setItem('slovensko_player_id', data.id)
      // Day rollover
      const today = getToday()
      let updates = {}
      if (data.today_date !== today) {
        updates.today_reviewed = 0
        updates.today_date = today
        if (data.streak_last_date) {
          const diff = daysBetween(data.streak_last_date, today)
          if (diff > 1) updates.streak_count = 0
        }
      }
      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('players').update(updates).eq('id', data.id).select().single()
        setPlayer(updated || { ...data, ...updates })
      } else {
        setPlayer(data)
      }
      setScreen('home')
    } catch {
      setNameError('Fehler beim Anmelden. Versuche es erneut.')
    }
    setNameLoading(false)
  }

  // --------------------------------------------------------
  // FLASHCARD SESSION
  // --------------------------------------------------------
  function startFlashcards() {
    const srs = player.srs_data || {}
    const cards = getSessionCards(srs)
    if (cards.length === 0) {
      setError('Keine Karten fällig! Komm später wieder.')
      setTimeout(() => setError(''), 2500)
      return
    }
    setSessionCards(cards)
    setSessionIndex(0)
    setFlipped(false)
    setSessionStats({ correct: 0, wrong: 0, xpEarned: 0 })
    setRepeatQueue([])
    setSrsChanges({})
    setScreen('flashcards')
  }

  function handleFlip() {
    setFlipped(true)
    const card = currentFlashcard()
    if (card) speak(card.sl)
  }

  function currentFlashcard() {
    if (sessionIndex < sessionCards.length) return sessionCards[sessionIndex]
    const rqi = sessionIndex - sessionCards.length
    if (rqi < repeatQueue.length) return repeatQueue[rqi]
    return null
  }

  function handleCardRate(correct) {
    const card = currentFlashcard()
    if (!card) return
    const srs = { ...(player.srs_data || {}), ...srsChanges }
    const current = srs[card.id] || { box: 0, lastReview: null }
    const today = getToday()
    let newBox, xpGain
    if (correct) {
      newBox = Math.min(current.box + 1, 5)
      xpGain = 10 + current.box * 5
    } else {
      newBox = 0
      xpGain = 2
      // add to repeat queue (only if not already from repeat queue)
      if (sessionIndex < sessionCards.length) {
        setRepeatQueue(q => [...q, card])
      }
    }
    const newSrsChanges = {
      ...srsChanges,
      [card.id]: { box: newBox, lastReview: today },
    }
    setSrsChanges(newSrsChanges)
    setSessionStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xpEarned: s.xpEarned + xpGain,
    }))
    // Advance
    const nextIndex = sessionIndex + 1
    const totalCards = sessionCards.length + (correct ? repeatQueue.length : repeatQueue.length + (sessionIndex < sessionCards.length ? 1 : 0))
    setSessionIndex(nextIndex)
    setFlipped(false)
  }

  function isSessionDone() {
    return sessionIndex >= sessionCards.length + repeatQueue.length
  }

  async function finishSession() {
    const today = getToday()
    const newSrs = { ...(player.srs_data || {}), ...srsChanges }
    const reviewed = (player.today_reviewed || 0) + sessionStats.correct + sessionStats.wrong
    const newXp = (player.xp || 0) + sessionStats.xpEarned
    // Streak
    let streakCount = player.streak_count || 0
    let streakLast = player.streak_last_date
    if (streakLast !== today) {
      streakCount += 1
      streakLast = today
    }
    await syncPlayer({
      srs_data: newSrs,
      xp: newXp,
      today_reviewed: reviewed,
      today_date: today,
      streak_count: streakCount,
      streak_last_date: streakLast,
    })
    setScreen('home')
  }

  // --------------------------------------------------------
  // QUIZ
  // --------------------------------------------------------
  function startQuiz() {
    const cards = shuffle(VOCAB).slice(0, QUIZ_SIZE)
    setQuizCards(cards)
    setQuizIndex(0)
    setQuizAnswered(null)
    setQuizStats({ correct: 0, wrong: 0, xpEarned: 0 })
    generateQuizOptions(cards, 0)
    setScreen('quiz')
  }

  function generateQuizOptions(cards, idx) {
    const card = cards[idx]
    if (!card) return
    // Get distractors from same category
    const sameCat = VOCAB.filter(v => v.cat === card.cat && v.id !== card.id)
    const otherCat = VOCAB.filter(v => v.cat !== card.cat)
    let distractors = shuffle(sameCat).slice(0, 2)
    // fill from other categories if needed
    while (distractors.length < 2) {
      const extra = shuffle(otherCat).find(v => !distractors.some(d => d.id === v.id))
      if (extra) distractors.push(extra)
      else break
    }
    const options = shuffle([card, ...distractors])
    setQuizOptions(options)
  }

  function handleQuizAnswer(selectedId) {
    if (quizAnswered !== null) return
    const card = quizCards[quizIndex]
    const correct = selectedId === card.id
    setQuizAnswered(selectedId)
    setQuizStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xpEarned: s.xpEarned + (correct ? 15 : 0),
    }))
    // Auto-advance after delay
    setTimeout(() => {
      const next = quizIndex + 1
      if (next >= quizCards.length) {
        setQuizIndex(next) // triggers summary
      } else {
        setQuizIndex(next)
        setQuizAnswered(null)
        generateQuizOptions(quizCards, next)
      }
    }, 1500)
  }

  function playQuizAudio() {
    const card = quizCards[quizIndex]
    if (card) speak(card.sl)
  }

  async function finishQuiz() {
    const today = getToday()
    const reviewed = (player.today_reviewed || 0) + quizStats.correct + quizStats.wrong
    const newXp = (player.xp || 0) + quizStats.xpEarned
    let streakCount = player.streak_count || 0
    let streakLast = player.streak_last_date
    if (streakLast !== today) {
      streakCount += 1
      streakLast = today
    }
    await syncPlayer({
      xp: newXp,
      today_reviewed: reviewed,
      today_date: today,
      streak_count: streakCount,
      streak_last_date: streakLast,
    })
    setScreen('home')
  }

  // --------------------------------------------------------
  // EMOJI-QUIZ (Bilder-Quiz)
  // --------------------------------------------------------
  function startEmojiQuiz() {
    const vocabWithEmoji = VOCAB.filter(v => EMOJIS[v.id])
    if (vocabWithEmoji.length < 4) {
      setError('Nicht genug Vokabeln mit Bildern.')
      setTimeout(() => setError(''), 2500)
      return
    }
    const cards = shuffle(vocabWithEmoji).slice(0, EMOJI_QUIZ_SIZE)
    setEmojiQuizCards(cards)
    setEmojiQuizIndex(0)
    setEmojiQuizAnswered(null)
    setEmojiQuizStats({ correct: 0, wrong: 0, xpEarned: 0 })
    generateEmojiQuizOptions(cards, 0)
    setScreen('emojiQuiz')
  }

  function generateEmojiQuizOptions(cards, idx) {
    const card = cards[idx]
    if (!card) return
    const sameCat = VOCAB.filter(v => v.cat === card.cat && v.id !== card.id && EMOJIS[v.id])
    const otherCat = VOCAB.filter(v => v.cat !== card.cat && EMOJIS[v.id])
    let distractors = shuffle(sameCat).slice(0, 3)
    while (distractors.length < 3) {
      const extra = shuffle(otherCat).find(v => !distractors.some(d => d.id === v.id))
      if (extra) distractors.push(extra)
      else break
    }
    setEmojiQuizOptions(shuffle([card, ...distractors]))
  }

  function handleEmojiQuizAnswer(selectedId) {
    if (emojiQuizAnswered !== null) return
    const card = emojiQuizCards[emojiQuizIndex]
    const correct = selectedId === card.id
    setEmojiQuizAnswered(selectedId)
    setEmojiQuizStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xpEarned: s.xpEarned + (correct ? 15 : 0),
    }))
    if (correct) speak(card.sl)
    setTimeout(() => {
      const next = emojiQuizIndex + 1
      if (next >= emojiQuizCards.length) {
        setEmojiQuizIndex(next)
      } else {
        setEmojiQuizIndex(next)
        setEmojiQuizAnswered(null)
        generateEmojiQuizOptions(emojiQuizCards, next)
      }
    }, 1500)
  }

  async function finishEmojiQuiz() {
    const today = getToday()
    const reviewed = (player.today_reviewed || 0) + emojiQuizStats.correct + emojiQuizStats.wrong
    const newXp = (player.xp || 0) + emojiQuizStats.xpEarned
    let streakCount = player.streak_count || 0
    let streakLast = player.streak_last_date
    if (streakLast !== today) {
      streakCount += 1
      streakLast = today
    }
    await syncPlayer({
      xp: newXp,
      today_reviewed: reviewed,
      today_date: today,
      streak_count: streakCount,
      streak_last_date: streakLast,
    })
    setScreen('home')
  }

  // --------------------------------------------------------
  // LEADERBOARD
  // --------------------------------------------------------
  async function loadLeaderboard() {
    setLbLoading(true)
    try {
      const { data } = await supabase
        .from('players')
        .select('id, name, xp, streak_count')
        .order('xp', { ascending: false })
        .limit(20)
      setLeaderboard(data || [])
    } catch { /* ignore */ }
    setLbLoading(false)
  }

  // --------------------------------------------------------
  // PLAY AUDIO HELPER
  // --------------------------------------------------------
  useEffect(() => {
    // Auto-play quiz audio when question changes
    if (screen === 'quiz' && quizIndex < quizCards.length && quizAnswered === null) {
      setTimeout(() => playQuizAudio(), 300)
    }
  }, [quizIndex, screen])

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------

  // -- Loading --
  if (screen === 'loading') {
    return (
      <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ animation: 'pulse 1.5s ease infinite' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🇸🇮</div>
          <div style={{ ...S.subtitle, textAlign: 'center' }}>Laden...</div>
        </div>
      </div>
    )
  }

  // -- Onboarding --
  if (screen === 'onboarding') {
    // Header (shared)
    const header = (
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🇸🇮</div>
        <h1 style={S.title}>Slovensko!</h1>
        <p style={{ ...S.subtitle, marginTop: '8px' }}>Lerne Slowenisch mit deinen Cousins</p>
      </div>
    )

    // Choose: Register or Login
    if (authMode === 'choose') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.6s ease 0.2s both' }}>
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%' }}
              onClick={() => { setAuthMode('register'); setNameError(''); setNameInput(''); setPasswordInput('') }}
            >
              Neu hier? Registrieren 🚀
            </button>
            <button
              style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
              onClick={() => { setAuthMode('login'); setNameError(''); setNameInput(''); setPasswordInput('') }}
            >
              Ich habe einen Account 🔑
            </button>
          </div>
        </div>
      )
    }

    // Register
    if (authMode === 'register') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease' }}>
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Name"
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError('') }}
              maxLength={20}
              autoFocus
            />
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Passwort wählen (min. 4 Zeichen)"
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
            {nameError && (
              <p style={{ color: COLORS.danger, fontSize: '13px', textAlign: 'center', animation: 'shake 0.4s ease' }}>
                {nameError}
              </p>
            )}
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%', opacity: nameLoading ? 0.6 : 1 }}
              onClick={handleRegister}
              disabled={nameLoading}
            >
              {nameLoading ? 'Wird geladen...' : 'Registrieren 🚀'}
            </button>
            <button
              style={{ ...S.backBtn, width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={() => setAuthMode('choose')}
            >
              ← Zurück
            </button>
          </div>
        </div>
      )
    }

    // Login
    if (authMode === 'login') {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          {header}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease' }}>
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Name"
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError('') }}
              maxLength={20}
              autoFocus
            />
            <input
              style={{ ...S.input, borderColor: nameError ? COLORS.danger : COLORS.surfaceLight, textAlign: 'center' }}
              placeholder="Dein Passwort"
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {nameError && (
              <p style={{ color: COLORS.danger, fontSize: '13px', textAlign: 'center', animation: 'shake 0.4s ease' }}>
                {nameError}
              </p>
            )}
            <button
              style={{ ...S.btn, ...S.btnPrimary, width: '100%', opacity: nameLoading ? 0.6 : 1 }}
              onClick={handleLogin}
              disabled={nameLoading}
            >
              {nameLoading ? 'Wird geladen...' : 'Anmelden 🔑'}
            </button>
            <button
              style={{ ...S.backBtn, width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={() => setAuthMode('choose')}
            >
              ← Zurück
            </button>
          </div>
        </div>
      )
    }
  }

  // -- Home --
  if (screen === 'home') {
    const p = player || {}
    const level = Math.floor((p.xp || 0) / XP_PER_LEVEL)
    const xpInLevel = (p.xp || 0) % XP_PER_LEVEL
    const dueCount = getDueCards(p.srs_data || {}).length
    const reviewed = p.today_reviewed || 0
    const goalProgress = Math.min(reviewed / DAILY_GOAL, 1)
    const streakAtRisk = p.streak_count > 0 && p.streak_last_date !== getToday()
    const goalReached = reviewed >= DAILY_GOAL

    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>
                Hej, {p.name}! 👋
              </h1>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ ...S.badge, background: COLORS.accentGlow, color: COLORS.accentLight }}>
                  ⭐ Level {level}
                </span>
                <span style={{ ...S.badge, background: 'rgba(255,255,255,0.06)', color: COLORS.textMuted }}>
                  {p.xp || 0} XP
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                animation: streakAtRisk ? 'pulse 1.5s ease infinite' : 'none',
              }}>🔥</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: streakAtRisk ? COLORS.gold : COLORS.text,
              }}>
                {p.streak_count || 0} Tage
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textMuted, marginBottom: '4px' }}>
              <span>Level {level}</span>
              <span>{xpInLevel}/{XP_PER_LEVEL} XP</span>
            </div>
            <div style={S.progressBar}>
              <div style={{
                ...S.progressFill,
                width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              }} />
            </div>
          </div>
        </div>

        {/* Streak Warning */}
        {streakAtRisk && (
          <div style={{
            ...S.card,
            background: COLORS.goldGlow,
            border: `1px solid ${COLORS.gold}`,
            padding: '14px 16px',
            animation: 'glow 2s ease infinite, fadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.gold }}>
              ⚠️ Dein {p.streak_count}-Tage-Streak ist in Gefahr!
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>
              Mach heute noch eine Übung, um ihn zu behalten.
            </div>
          </div>
        )}

        {/* Daily Goal */}
        <div style={{ ...S.card, animation: 'fadeIn 0.4s ease 0.1s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {goalReached ? '🎉 Tagesziel erreicht!' : '📝 Tagesziel'}
            </span>
            <span style={{ fontSize: '13px', color: COLORS.textMuted }}>
              {reviewed}/{DAILY_GOAL}
            </span>
          </div>
          <div style={S.progressBar}>
            <div style={{
              ...S.progressFill,
              width: `${goalProgress * 100}%`,
              background: goalReached
                ? `linear-gradient(90deg, ${COLORS.gold}, #fcd34d)`
                : `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              animation: 'progressFill 0.8s ease',
            }} />
          </div>
        </div>

        {/* Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.2s both',
              border: `1px solid rgba(52, 211, 153, 0.2)`,
            }}
            onClick={startFlashcards}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: COLORS.accentGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>📇</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Karteikarten</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                {dueCount} Karten fällig
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>

          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.3s both',
              border: `1px solid rgba(251, 191, 36, 0.15)`,
            }}
            onClick={startQuiz}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: COLORS.goldGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>🎧</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Hörquiz</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                Teste dein Hörverstehen
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>

          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.35s both',
              border: `1px solid rgba(168, 85, 247, 0.2)`,
            }}
            onClick={startEmojiQuiz}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>🖼️</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Bilder-Quiz</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                Lerne mit Bildern
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>

          <button
            style={{
              ...S.card,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              textAlign: 'left',
              animation: 'fadeIn 0.4s ease 0.4s both',
            }}
            onClick={() => { loadLeaderboard(); setScreen('leaderboard') }}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>🏆</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: 'clamp(16px, 4vw, 18px)' }}>Leaderboard</div>
              <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '2px' }}>
                Sieh, wer vorne liegt
              </div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '20px' }}>›</div>
          </button>
        </div>

        {/* Vocab Stats */}
        <div style={{ fontSize: '12px', color: COLORS.textDim, textAlign: 'center', paddingBottom: '8px' }}>
          {VOCAB.length} Vokabeln · {Object.keys(p.srs_data || {}).length} gelernt
        </div>

        {/* Error Toast */}
        {error && (
          <div style={{
            position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
            background: COLORS.surface, color: COLORS.text, padding: '12px 20px',
            borderRadius: '12px', fontSize: '14px', fontWeight: '500',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease',
            zIndex: 100, whiteSpace: 'nowrap',
          }}>
            {error}
          </div>
        )}

        {/* Level Up Overlay */}
        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Flashcards --
  if (screen === 'flashcards') {
    const card = currentFlashcard()
    const total = sessionCards.length + repeatQueue.length
    const done = isSessionDone()

    if (done) {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {sessionStats.correct > sessionStats.wrong ? '🎉' : '💪'}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>Session fertig!</h2>
          </div>
          <div style={{ ...S.card, width: '100%', maxWidth: '340px', animation: 'slideUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.accentLight }}>{sessionStats.correct}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Richtig</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.danger }}>{sessionStats.wrong}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Falsch</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.gold }}>+{sessionStats.xpEarned}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>XP</div>
              </div>
            </div>
          </div>
          <button
            style={{ ...S.btn, ...S.btnPrimary, width: '100%', maxWidth: '340px' }}
            onClick={finishSession}
          >
            Weiter
          </button>
        </div>
      )
    }

    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '600' }}>
            {sessionIndex + 1} / {total}
          </span>
        </div>

        {/* Progress */}
        <div style={S.progressBar}>
          <div style={{
            ...S.progressFill,
            width: `${((sessionIndex) / total) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          }} />
        </div>

        {/* Card */}
        {card && (
          <div style={{
            ...S.card,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            animation: 'fadeIn 0.3s ease',
            minHeight: '300px',
          }}>
            <span style={{
              ...S.badge,
              background: 'rgba(255,255,255,0.06)',
              color: COLORS.textMuted,
            }}>
              {CAT_ICONS[card.cat] || '📖'} {card.cat}
            </span>

            <div style={{
              fontSize: 'clamp(26px, 7vw, 36px)',
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {card.de}
            </div>

            {!flipped ? (
              <button
                style={{ ...S.btn, ...S.btnPrimary, minWidth: '200px', marginTop: '16px' }}
                onClick={handleFlip}
              >
                Aufdecken 👀
              </button>
            ) : (
              <>
                <div style={{
                  fontSize: 'clamp(28px, 8vw, 40px)',
                  fontWeight: '800',
                  color: COLORS.accentLight,
                  textAlign: 'center',
                  animation: 'popIn 0.4s ease',
                  lineHeight: 1.3,
                }}>
                  {card.sl}
                </div>
                <button
                  style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', touchAction: 'manipulation', padding: '8px' }}
                  onClick={() => speak(card.sl)}
                >
                  🔊
                </button>
              </>
            )}
          </div>
        )}

        {/* Rating Buttons */}
        {flipped && (
          <div style={{ display: 'flex', gap: '12px', animation: 'slideUp 0.3s ease' }}>
            <button
              style={{ ...S.btn, ...S.btnDanger, flex: 1 }}
              onClick={() => handleCardRate(false)}
            >
              Nochmal ✗
            </button>
            <button
              style={{ ...S.btn, ...S.btnPrimary, flex: 1 }}
              onClick={() => handleCardRate(true)}
            >
              Gewusst! ✓
            </button>
          </div>
        )}

        {/* Bottom Back Button */}
        <button
          style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
          onClick={() => { finishSession() }}
        >
          ← Zurück
        </button>

        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Quiz --
  if (screen === 'quiz') {
    const done = quizIndex >= quizCards.length

    if (done) {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {quizStats.correct >= 7 ? '🏆' : quizStats.correct >= 4 ? '👍' : '📚'}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>Quiz fertig!</h2>
          </div>
          <div style={{ ...S.card, width: '100%', maxWidth: '340px', animation: 'slideUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.accentLight }}>{quizStats.correct}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Richtig</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.danger }}>{quizStats.wrong}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Falsch</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.gold }}>+{quizStats.xpEarned}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>XP</div>
              </div>
            </div>
          </div>
          <button
            style={{ ...S.btn, ...S.btnPrimary, width: '100%', maxWidth: '340px' }}
            onClick={finishQuiz}
          >
            Weiter
          </button>
        </div>
      )
    }

    const card = quizCards[quizIndex]
    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '600' }}>
            {quizIndex + 1} / {QUIZ_SIZE}
          </span>
        </div>

        {/* Progress */}
        <div style={S.progressBar}>
          <div style={{
            ...S.progressFill,
            width: `${(quizIndex / QUIZ_SIZE) * 100}%`,
            background: `linear-gradient(90deg, ${COLORS.gold}, #fcd34d)`,
          }} />
        </div>

        {/* Question */}
        <div style={{
          ...S.card,
          textAlign: 'center',
          padding: '32px 20px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '8px' }}>
            Was hörst du?
          </div>
          <button
            style={{
              background: COLORS.accentGlow,
              border: `2px solid ${COLORS.accentLight}`,
              borderRadius: '50%',
              width: '80px', height: '80px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', cursor: 'pointer', touchAction: 'manipulation',
              margin: '12px auto',
              transition: 'transform 0.15s',
            }}
            onClick={playQuizAudio}
          >
            🔊
          </button>
          <div style={{ fontSize: '13px', color: COLORS.textDim }}>
            Tippe zum Abspielen
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {quizOptions.map(opt => {
            const isCorrect = opt.id === card.id
            const isSelected = quizAnswered === opt.id
            const showResult = quizAnswered !== null
            let bg = COLORS.surface
            let borderColor = 'rgba(255,255,255,0.08)'
            if (showResult && isCorrect) {
              bg = 'rgba(5, 150, 105, 0.2)'
              borderColor = COLORS.accentLight
            } else if (showResult && isSelected && !isCorrect) {
              bg = 'rgba(239, 68, 68, 0.2)'
              borderColor = COLORS.danger
            }
            return (
              <button
                key={opt.id}
                style={{
                  ...S.card,
                  padding: '16px 20px',
                  cursor: showResult ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '600',
                  textAlign: 'left',
                  background: bg,
                  borderColor,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onClick={() => handleQuizAnswer(opt.id)}
              >
                <span style={{ flex: 1 }}>{opt.de}</span>
                {showResult && isCorrect && <span style={{ animation: 'popIn 0.3s ease' }}>✅</span>}
                {showResult && isSelected && !isCorrect && <span style={{ animation: 'shake 0.4s ease' }}>❌</span>}
              </button>
            )
          })}
        </div>

        {/* Bottom Back Button */}
        <button
          style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
          onClick={() => { finishQuiz() }}
        >
          ← Zurück
        </button>

        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Emoji Quiz (Bilder-Quiz) --
  if (screen === 'emojiQuiz') {
    const done = emojiQuizIndex >= emojiQuizCards.length

    if (done) {
      return (
        <div style={{ ...S.screen, alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
          <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {emojiQuizStats.correct >= 7 ? '🖼️' : emojiQuizStats.correct >= 4 ? '👀' : '📚'}
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700' }}>Bilder-Quiz fertig!</h2>
          </div>
          <div style={{ ...S.card, width: '100%', maxWidth: '340px', animation: 'slideUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.accentLight }}>{emojiQuizStats.correct}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Richtig</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.danger }}>{emojiQuizStats.wrong}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Falsch</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.gold }}>+{emojiQuizStats.xpEarned}</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>XP</div>
              </div>
            </div>
          </div>
          <button
            style={{ ...S.btn, ...S.btnPrimary, width: '100%', maxWidth: '340px' }}
            onClick={finishEmojiQuiz}
          >
            Weiter
          </button>
        </div>
      )
    }

    const card = emojiQuizCards[emojiQuizIndex]
    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted, fontWeight: '600' }}>
            {emojiQuizIndex + 1} / {EMOJI_QUIZ_SIZE}
          </span>
        </div>

        {/* Progress */}
        <div style={S.progressBar}>
          <div style={{
            ...S.progressFill,
            width: `${(emojiQuizIndex / EMOJI_QUIZ_SIZE) * 100}%`,
            background: 'linear-gradient(90deg, #a855f7, #c084fc)',
          }} />
        </div>

        {/* Emoji Display */}
        <div style={{
          ...S.card,
          textAlign: 'center',
          padding: '24px 20px',
          animation: 'fadeIn 0.3s ease',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.03))',
          border: '1px solid rgba(168, 85, 247, 0.2)',
        }}>
          <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '8px' }}>
            Was siehst du?
          </div>
          <div style={{
            fontSize: 'clamp(80px, 20vw, 120px)',
            lineHeight: 1,
            padding: '16px 0',
            animation: 'popIn 0.4s ease',
          }}>
            {EMOJIS[card.id]}
          </div>
          <div style={{ fontSize: '13px', color: COLORS.textDim, marginTop: '4px' }}>
            Wähle das richtige slowenische Wort
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {emojiQuizOptions.map(opt => {
            const isCorrect = opt.id === card.id
            const isSelected = emojiQuizAnswered === opt.id
            const showResult = emojiQuizAnswered !== null
            let bg = COLORS.surface
            let borderColor = 'rgba(255,255,255,0.08)'
            if (showResult && isCorrect) {
              bg = 'rgba(5, 150, 105, 0.2)'
              borderColor = COLORS.accentLight
            } else if (showResult && isSelected && !isCorrect) {
              bg = 'rgba(239, 68, 68, 0.2)'
              borderColor = COLORS.danger
            }
            return (
              <button
                key={opt.id}
                style={{
                  ...S.card,
                  padding: '16px 20px',
                  cursor: showResult ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '600',
                  textAlign: 'left',
                  background: bg,
                  borderColor,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onClick={() => handleEmojiQuizAnswer(opt.id)}
              >
                <span style={{ flex: 1 }}>{opt.sl}</span>
                {showResult && isCorrect && <span style={{ animation: 'popIn 0.3s ease' }}>✅</span>}
                {showResult && isSelected && !isCorrect && <span style={{ animation: 'shake 0.4s ease' }}>❌</span>}
              </button>
            )
          })}
        </div>

        {/* Show translation after answer */}
        {emojiQuizAnswered !== null && (
          <div style={{
            textAlign: 'center',
            fontSize: '14px',
            color: COLORS.textMuted,
            animation: 'fadeIn 0.3s ease',
          }}>
            = <strong style={{ color: COLORS.text }}>{card.de}</strong>
          </div>
        )}

        {/* Bottom Back Button */}
        <button
          style={{ ...S.btn, ...S.btnSecondary, width: '100%' }}
          onClick={finishEmojiQuiz}
        >
          ← Zurück
        </button>

        {showLevelUp && <LevelUpOverlay level={newLevel} />}
      </div>
    )
  }

  // -- Leaderboard --
  if (screen === 'leaderboard') {
    const medals = ['🥇', '🥈', '🥉']
    return (
      <div style={{ ...S.screen, gap: '16px' }}>
        <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: '700', textAlign: 'center' }}>
          🏆 Leaderboard
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'auto' }}>
          {leaderboard.map((entry, i) => {
            const isMe = player && entry.id === player.id
            return (
              <div
                key={entry.id}
                style={{
                  ...S.card,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                  border: isMe ? `2px solid ${COLORS.accentLight}` : `1px solid rgba(255,255,255,0.05)`,
                  background: isMe ? 'rgba(52, 211, 153, 0.08)' : COLORS.surface,
                }}
              >
                <div style={{
                  width: '32px',
                  textAlign: 'center',
                  fontSize: i < 3 ? '20px' : '14px',
                  fontWeight: '700',
                  color: i < 3 ? COLORS.gold : COLORS.textMuted,
                }}>
                  {i < 3 ? medals[i] : `${i + 1}.`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.name} {isMe && '(Du)'}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                    🔥 {entry.streak_count || 0} Tage
                  </div>
                </div>
                <div style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  color: COLORS.gold,
                }}>
                  {entry.xp} XP
                </div>
              </div>
            )
          })}
          {leaderboard.length === 0 && !lbLoading && (
            <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '40px 0' }}>
              Noch keine Spieler
            </div>
          )}
          {lbLoading && (
            <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '40px 0', animation: 'pulse 1.5s ease infinite' }}>
              Laden...
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{ ...S.btn, ...S.btnSecondary, flex: 1 }}
            onClick={() => setScreen('home')}
          >
            ← Zurück
          </button>
          <button
            style={{ ...S.btn, ...S.btnSecondary, flex: 1, color: COLORS.accentLight }}
            onClick={loadLeaderboard}
            disabled={lbLoading}
          >
            {lbLoading ? '...' : '↻ Aktualisieren'}
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ============================================================
// LEVEL UP OVERLAY
// ============================================================
function LevelUpOverlay({ level }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        textAlign: 'center',
        animation: 'popIn 0.5s ease',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: `linear-gradient(135deg, ${COLORS.gold}, #fcd34d)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Level {level}!
        </h2>
        <p style={{ color: COLORS.textMuted, marginTop: '8px', fontSize: '16px' }}>
          Weiter so! 💪
        </p>
      </div>
    </div>
  )
}
