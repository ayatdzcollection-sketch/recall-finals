/* data/history-timeline.js — chronological events for the interactive
   History timeline + "put them in order" challenge. Dates/events come from
   the Semester 2 World History study guide. */
(function (STUDY) {
  "use strict";
  STUDY.TIMELINE = [
    { year: 1760, label: "Industrial Revolution begins", era: "Industrial Age", text: "Starts in Great Britain (resources, geography, capital). Urbanization, the steam engine (James Watt), factories, pollution, and labor unions." },
    { year: 1857, label: "Sepoy Rebellion (India)", era: "Imperialism", text: "An uprising against British rule, sparked when rifle cartridges greased with animal fat offended Hindu and Muslim soldiers." },
    { year: 1868, label: "Meiji Restoration (Japan)", era: "Nationalism & Imperialism", text: "Japan rapidly modernizes its military and legal systems after Western models — fast and state-directed." },
    { year: 1871, label: "Germany unified", era: "Nationalism", text: "Otto von Bismarck unifies Germany using Realpolitik ('blood and iron'). Germany becomes an industrial giant." },
    { year: 1884, label: "Berlin Conference", era: "Imperialism", text: "European powers carve up Africa with no African input. Ethiopia (and Liberia) resist colonization." },
    { year: 1914, label: "World War I begins", era: "World War I", text: "Sparked by the assassination of Archduke Franz Ferdinand. M-A-I-N causes: Militarism, Alliances, Imperialism, Nationalism. Trench warfare & No Man's Land." },
    { year: 1917, label: "Russian Revolution", era: "World War I", text: "Military losses, food/fuel shortages, and anger at the Czar push Russia into revolt — and out of WWI." },
    { year: 1919, label: "Treaty of Versailles", era: "Interwar", text: "Ends WWI; Germans saw its reparations and territorial losses as harsh and humiliating. League of Nations created." },
    { year: 1929, label: "Great Depression begins", era: "Interwar", text: "Worldwide economic collapse — mass unemployment. Economic chaos + wounded pride let dictators (Hitler, Mussolini) rise." },
    { year: 1939, label: "World War II begins", era: "World War II", text: "Appeasement let Hitler seize lands unchecked. Germany's central location forced a multi-front war. Lend-Lease aided the Allies." },
    { year: 1941, label: "The Holocaust / Final Solution", era: "World War II", text: "Hitler's state-sponsored plan to systematically murder Europe's Jews — the genocide known as the Holocaust." },
    { year: 1945, label: "WWII ends · UN founded", era: "Cold War", text: "The US and USSR emerge as superpowers. The United Nations is established to keep the peace." },
    { year: 1947, label: "Partition of India", era: "Decolonization", text: "Britain divides the region into India and Pakistan over Hindu–Muslim conflict. Gandhi's nonviolence had driven independence." },
    { year: 1948, label: "Marshall Plan & Berlin Airlift", era: "Cold War", text: "US aid rebuilds Western Europe (Greece & Turkey too). The Berlin Airlift is the first major US–USSR confrontation." },
    { year: 1949, label: "Chinese Communist victory", era: "Cold War", text: "The Chinese Civil War ends with a communist victory under Mao Zedong." },
    { year: 1950, label: "Korean War", era: "Cold War", text: "Ends in a stalemate at the 38th parallel, leaving a permanently divided Korea." },
    { year: 1955, label: "Warsaw Pact", era: "Cold War", text: "Framed as a defense against NATO; really kept Soviet troops in satellite states under Moscow's control." },
    { year: 1960, label: "Year of Africa", era: "Decolonization", text: "Seventeen African nations gain independence in this single year." },
    { year: 1961, label: "Berlin Wall built", era: "Cold War", text: "East Germany builds it to stop citizens fleeing to capitalist West Berlin. The Iron Curtain (Churchill's term) divides Europe." },
    { year: 1965, label: "Vietnam War escalates", era: "Cold War", text: "The Domino Theory — if one nation falls to communism its neighbors follow — justifies US intervention." },
    { year: 1991, label: "USSR collapses", era: "End of the Cold War", text: "Gorbachev's glasnost (openness) and perestroika (restructuring) weaken state control; communism and the USSR collapse." },
    { year: 1994, label: "Rwandan Genocide · Apartheid ends", era: "Modern Conflicts", text: "Hutu extremists slaughter the Tutsi minority. In South Africa, apartheid ends; Mandela (like Gandhi) used nonviolent protest." },
  ];
})(window.STUDY);
