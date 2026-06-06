/* WORLD HISTORY (lightest weighting, but term-dense).
   Combines both study guides; the real final is ~70 multiple choice + ~30
   matching (People / Events / Vocabulary), so flashcards are written as
   term↔definition pairs that also feed the printable matching section. */
(function (STUDY) {
  "use strict";
  STUDY.register({
    id: "history",
    name: "History",
    icon: "🌍",
    accent: "#c98bff",
    weight: 2,
    intro: "World History, Semester 2: from the Industrial Revolution through the World Wars, the Cold War, and decolonization. The real final is **~70 multiple choice plus ~30 matching** (People, Events, Vocabulary).",
    topics: [

      /* 1. Industrial Revolution */
      {
        id: "his-industrial",
        title: "Industrial Revolution & Economic Theories",
        blurb: "Urbanization, the steam engine, capitalism vs. socialism.",
        lesson: [
          { defs: [
            ["Industrial Revolution", "The shift to factory production; **England (Great Britain)** led it thanks to resources, geography, and capital."],
            ["Urbanization", "People moving from farms to **cities** for factory jobs."],
            ["Land Enclosure", "Consolidating small farms into large, fenced, privately-owned land — pushing peasants toward cities."],
            ["Steam Engine", "Improved by **James Watt**; the key new power source (ran trains and boats)."],
            ["Putting-Out / Cottage System", "Merchants gave raw materials to peasants who finished goods (esp. cloth) at home."],
            ["Liverpool & Manchester", "Two of the biggest industrial-era cities in England."],
            ["Labor Unions", "Worker groups that fought to **ban child labor**, improve **safety**, and raise **wages**."],
          ] },
          { h: "Two economic systems" },
          { defs: [
            ["Capitalism", "Means of production **privately owned** for profit; free markets, competition, **laissez-faire** (little government)."],
            ["Socialism / Communism", "Community or **state owns** the means of production → a **classless society**. **Karl Marx** wrote in reaction to industrial capitalism's inequalities."],
          ] },
          { tip: "Capitalism = **private** owners + free market. Communism = **state/community** ownership. Marx reacted *against* the harsh inequalities of capitalism." },
        ],
        visual: {
          type: "compare", cap: "Capitalism vs. Socialism/Communism",
          left: { h: "Capitalism", items: ["**Private** ownership", "Free markets & competition", "Laissez-faire", "Profit-driven"] },
          right: { h: "Socialism / Communism", items: ["**State / community** ownership", "Classless society", "Karl Marx's response", "Shared production"] },
        },
        cards: [
          { front: "Which nation led the Industrial Revolution?", back: "England (Great Britain)." },
          { front: "Urbanization", back: "People moving from rural areas to cities for factory work." },
          { front: "Who improved the steam engine?", back: "James Watt." },
          { front: "Land Enclosure", back: "Combining small farms into large private, fenced-off land." },
          { front: "Putting-out / cottage system", back: "Merchants gave raw materials to peasants to finish goods at home." },
          { front: "Capitalism", back: "Private ownership of production for profit; free markets, laissez-faire." },
          { front: "Karl Marx", back: "Critiqued industrial capitalism; basis of socialism/communism." },
          { front: "Goals of labor unions", back: "Ban child labor, improve safety, and raise wages." },
        ],
        questions: [
          { type: "mc", q: "Which country led the Industrial Revolution?", choices: ["France", "England (Great Britain)", "Japan", "Russia"], answer: 1 },
          { type: "mc", q: "Who is credited with improving the steam engine?", choices: ["Karl Marx", "James Watt", "Otto von Bismarck", "Cecil Rhodes"], answer: 1 },
          { type: "mc", q: "In capitalism, the means of production are:", choices: ["owned by the state", "privately owned for profit", "shared equally by all", "owned by labor unions"], answer: 1 },
          { type: "mc", q: "Karl Marx developed his ideas mainly as a reaction against:", choices: ["the inequalities of industrial capitalism", "the steam engine", "the French monarchy", "labor unions"], answer: 0 },
        ],
      },

      /* 2. Nationalism & Unification */
      {
        id: "his-nationalism",
        title: "Nationalism, Unification & Meiji Japan",
        blurb: "Realpolitik, Bismarck & Cavour, and Japan's rapid modernization.",
        lesson: [
          { defs: [
            ["Nationalism", "Pride/loyalty to one's nation — a force that both unified countries and fueled conflict."],
            ["Realpolitik", "'Realistic politics' based on the **practical needs of the state**, not morals or ideology."],
            ["Otto von Bismarck", "Used Realpolitik to **unify Germany** (1871)."],
            ["Camillo di Cavour", "Used Realpolitik to help **unify Italy**."],
            ["Germany's Rise", "After unifying in **1871**, Germany became an industrial giant with pioneering social reforms."],
            ["Meiji Reforms (Japan)", "Japan **rapidly modernized**, modeling its military and legal systems on the West — fast and state-directed."],
            ["Russification", "Forcing Russian language/culture on non-Russian peoples in the empire."],
          ] },
          { tip: "Bismarck (Germany) & Cavour (Italy) are the **unification duo**, both driven by **Realpolitik**." },
        ],
        visual: {
          type: "table", cap: "The unifiers",
          head: ["Leader", "Nation", "Method"],
          rows: [["Otto von Bismarck", "Germany (1871)", "Realpolitik"], ["Camillo di Cavour", "Italy", "Realpolitik"], ["Meiji leaders", "Japan", "Modernize on Western model"]],
        },
        cards: [
          { front: "Realpolitik", back: "Politics based on the practical needs of the state, not morals/ideology." },
          { front: "Otto von Bismarck", back: "Unified Germany (1871) using Realpolitik." },
          { front: "Camillo di Cavour", back: "Helped unify Italy using Realpolitik." },
          { front: "Meiji reforms", back: "Japan rapidly modernized, copying Western military and legal systems." },
          { front: "Russification", back: "Forcing Russian language and culture onto non-Russian subjects." },
          { front: "Germany unified in what year?", back: "1871." },
        ],
        questions: [
          { type: "mc", q: "'Realpolitik' is best defined as:", choices: ["politics based on religious morals", "politics based on the practical needs of the state", "rule by the working class", "a type of nationalism"], answer: 1 },
          { type: "mc", q: "Bismarck (Germany) and Cavour (Italy) are both known for:", choices: ["leading communist revolutions", "unifying their nations through Realpolitik", "colonizing Africa", "starting WWI"], answer: 1 },
          { type: "mc", q: "How did Meiji Japan's modernization differ from the West's?", choices: ["It was slower and gradual", "It was rapid and state-directed, copying Western models", "It rejected all foreign ideas", "It avoided building a military"], answer: 1 },
        ],
      },

      /* 3. Imperialism */
      {
        id: "his-imperialism",
        title: "The Age of Imperialism",
        blurb: "Social Darwinism, the Berlin Conference, and resistance.",
        lesson: [
          { defs: [
            ["Imperialism", "Powerful nations taking control of weaker territories for resources, markets, and status."],
            ["Social Darwinism", "A pseudoscientific 'survival of the fittest' applied to societies — used to **justify racism and imperialism**."],
            ["Berlin Conference", "European powers met to **carve up Africa**; borders were drawn entirely by Europeans, with no African input."],
            ["Ethiopia (and Liberia)", "Among the **few African nations to resist** colonization and stay independent."],
            ["Sepoy Rebellion", "Uprising in **India** after British rifle cartridges greased with animal fat offended Hindu & Muslim soldiers."],
            ["Belgium & the Congo", "Belgium colonized the Congo, committing brutal atrocities."],
            ["Cecil Rhodes", "Imperialist who wanted to 'paint the map red' (spread the British Empire)."],
          ] },
          { tip: "Berlin Conference = Europeans dividing Africa **without Africans**. Ethiopia & Liberia are the famous holdouts." },
        ],
        visual: {
          type: "compare", cap: "Two views of imperialism",
          left: { h: "The imperialist (Cecil Rhodes)", items: ["A 'divine mission'", "Spread the 'superior' British race", "'Paint the map red'"] },
          right: { h: "The colonized (Chief Kabongo)", items: ["European laws felt alien", "Left feeling 'strange and helpless'", "No say in their own rule"] },
        },
        cards: [
          { front: "Social Darwinism", back: "Pseudoscientific 'survival of the fittest' for societies; used to justify racism/imperialism." },
          { front: "Berlin Conference", back: "Meeting where European powers divided Africa among themselves." },
          { front: "Which African nations resisted colonization?", back: "Ethiopia (and Liberia)." },
          { front: "Sepoy Rebellion", back: "Indian uprising sparked by rifle cartridges greased with animal fat (offended Hindus & Muslims)." },
          { front: "Cecil Rhodes", back: "British imperialist who wanted to 'paint the map red.'" },
          { front: "Belgium colonized which region?", back: "The Congo (with brutal atrocities)." },
        ],
        questions: [
          { type: "mc", q: "Social Darwinism was used primarily to:", choices: ["promote democracy", "justify racism and imperialist expansion", "end the slave trade", "unify Germany"], answer: 1 },
          { type: "mc", q: "At the Berlin Conference, Africa's borders were determined by:", choices: ["African kings", "the United Nations", "European powers, with no African input", "a vote of the people"], answer: 2 },
          { type: "mc", q: "Which African nation is famous for resisting European colonization?", choices: ["Nigeria", "Ethiopia", "Egypt", "Kenya"], answer: 1 },
          { type: "mc", q: "The Sepoy Rebellion in India was sparked by:", choices: ["a tax on tea", "rifle cartridges greased with animal fat", "a famine", "the building of railroads"], answer: 1 },
        ],
      },

      /* 4. WWI */
      {
        id: "his-wwi",
        title: "World War I & the Russian Revolution",
        blurb: "M-A-I-N causes, the spark, trench warfare, and Russia's exit.",
        lesson: [
          { defs: [
            ["The Balkans ('Powder Keg')", "Region of ethnic tension and nationalism that helped ignite WWI."],
            ["M-A-I-N causes", "**M**ilitarism, **A**lliances, **I**mperialism, **N**ationalism. (The League of Nations came *after* WWI — not a cause.)"],
            ["The Spark", "Assassination of **Archduke Franz Ferdinand** of Austria-Hungary."],
            ["No Man's Land", "The deadly open ground **between opposing trenches**."],
            ["Propaganda / Total War", "Posters like 'Don't Waste Bread!' pushed civilians to ration food (vs. German U-boats)."],
            ["Russia's Exit", "Military losses + food/fuel shortages + anger at the Czar → **Russian Revolution**, and Russia dropped out of WWI."],
            ["Treaty of Versailles", "Ended WWI; Germans saw its reparations and territory losses as **harsh and humiliating**."],
          ] },
          { tip: "Causes of WWI = **MAIN** (Militarism, Alliances, Imperialism, Nationalism). The **spark** = Franz Ferdinand's assassination." },
        ],
        visual: {
          type: "concept", cap: "The four MAIN causes of WWI",
          hub: "WWI",
          leaves: [
            { b: "Militarism", s: "arms build-ups" },
            { b: "Alliances", s: "entangling treaties" },
            { b: "Imperialism", s: "colonial competition" },
            { b: "Nationalism", s: "ethnic pride & rivalry" },
          ],
        },
        cards: [
          { front: "The four MAIN causes of WWI", back: "Militarism, Alliances, Imperialism, Nationalism." },
          { front: "What event sparked WWI?", back: "The assassination of Archduke Franz Ferdinand." },
          { front: "The Balkans were nicknamed…", back: "The 'Powder Keg' of Europe." },
          { front: "No Man's Land", back: "The dangerous ground between opposing trench lines." },
          { front: "Why did Russia exit WWI?", back: "The Russian Revolution — losses, shortages, and anger at the Czar." },
          { front: "Treaty of Versailles", back: "Ended WWI; Germans viewed its terms as harsh and humiliating." },
        ],
        questions: [
          { type: "mc", q: "The acronym for the causes of WWI (M-A-I-N) stands for:", choices: ["Money, Armies, Italy, Nazis", "Militarism, Alliances, Imperialism, Nationalism", "Marx, Africa, India, Napoleon", "Migration, Arts, Industry, Navy"], answer: 1 },
          { type: "mc", q: "What event is considered the 'spark' that started WWI?", choices: ["The sinking of the Lusitania", "The assassination of Archduke Franz Ferdinand", "The Treaty of Versailles", "The Russian Revolution"], answer: 1 },
          { type: "mc", q: "Russia dropped out of WWI mainly because of:", choices: ["a victory over Germany", "the Russian Revolution and internal collapse", "the Marshall Plan", "the Berlin Airlift"], answer: 1 },
          { type: "tf", q: "Germans generally viewed the Treaty of Versailles as fair and generous.", answer: false, explain: "They saw it as harsh and humiliating — fueling later resentment." },
        ],
      },

      /* 5. Interwar & totalitarianism */
      {
        id: "his-interwar",
        title: "Interwar Years & Totalitarianism",
        blurb: "Great Depression, Gandhi, fascism, and the rise of dictators.",
        lesson: [
          { defs: [
            ["Great Depression", "Worldwide economic collapse — mass **inflation and unemployment**."],
            ["Gandhi", "Led India's independence movement through **nonviolent resistance** and civil disobedience."],
            ["Mandate System", "League of Nations split former Ottoman lands among victors → triggered **Pan-Arabism**."],
            ["Fascism", "Absolute supremacy of the leader/state, extreme nationalism, brutal suppression of opposition."],
            ["Why dictators rose", "Depression chaos + wounded pride let **Hitler** and **Mussolini** promise stability and nationalism."],
            ["Japanese Imperialism", "Japan expanded for resources — notably the brutal **invasion of Manchuria**."],
          ] },
          { tip: "Economic desperation (the Depression) + national humiliation = the soil in which dictators like Hitler and Mussolini grew." },
        ],
        visual: {
          type: "table", cap: "Interwar leaders & movements",
          head: ["Person / term", "Associated with"],
          rows: [["Gandhi", "Nonviolent independence (India)"], ["Hitler", "Fascism / Nazi Germany"], ["Mussolini", "Fascism (Italy)"], ["Pan-Arabism", "Reaction to the Mandate System"]],
        },
        cards: [
          { front: "Great Depression", back: "A worldwide economic collapse causing mass inflation and unemployment." },
          { front: "Gandhi's method", back: "Nonviolent resistance and civil disobedience." },
          { front: "Fascism", back: "Supremacy of the leader/state, extreme nationalism, suppression of opposition." },
          { front: "Why did dictators like Hitler and Mussolini rise?", back: "Economic chaos + wounded national pride; they promised stability and nationalism." },
          { front: "Mandate System → which movement?", back: "Pan-Arabism (reaction to foreign control of the Middle East)." },
          { front: "Japan's invasion of Manchuria showed…", back: "Aggressive Japanese imperialism for resources." },
        ],
        questions: [
          { type: "mc", q: "Gandhi led India's independence movement primarily through:", choices: ["armed rebellion", "nonviolent resistance and civil disobedience", "alliance with Germany", "economic sanctions"], answer: 1 },
          { type: "mc", q: "Fascism is characterized by:", choices: ["a classless society with no government", "supremacy of the leader/state and extreme nationalism", "free markets and democracy", "nonviolence"], answer: 1 },
          { type: "mc", q: "Dictators like Hitler and Mussolini rose to power largely because of:", choices: ["economic chaos and wounded national pride", "the success of the League of Nations", "the Marshall Plan", "decolonization"], answer: 0 },
        ],
      },

      /* 6. WWII & Holocaust */
      {
        id: "his-wwii",
        title: "World War II & the Holocaust",
        blurb: "Appeasement, Lend-Lease, two fronts, and the Final Solution.",
        lesson: [
          { defs: [
            ["Appeasement", "Giving in to Hitler's demands to avoid war — which let him seize lands unchecked."],
            ["Lend-Lease Act", "U.S. sent military supplies/aid to the Allies **without entering combat** (at first)."],
            ["Two-Front War", "Germany's central location forced it to **split its forces** and fight on several fronts."],
            ["The 'Final Solution'", "Hitler's state-sponsored plan to **systematically murder every European Jew**."],
            ["The Holocaust", "The term for this mass genocide of six million Jews (and millions of others)."],
          ] },
          { tip: "**Appeasement** = trying to keep peace by giving in — it failed and emboldened Hitler." },
        ],
        visual: {
          type: "timeline", cap: "Key WWII concepts",
          events: [
            { d: "Before the war", t: "**Appeasement** lets Hitler expand unchecked" },
            { d: "U.S. role", t: "**Lend-Lease** aids Allies without direct combat" },
            { d: "Strategy", t: "Germany trapped in a **two-front war**" },
            { d: "Genocide", t: "The **'Final Solution'** → the **Holocaust**" },
          ],
        },
        cards: [
          { front: "Appeasement", back: "Giving in to Hitler's demands to avoid war (it failed)." },
          { front: "Lend-Lease Act", back: "The U.S. supplied the Allies with aid without joining combat directly." },
          { front: "Germany's 'geographic disadvantage'", back: "Its central location forced it to fight a war on multiple fronts." },
          { front: "The 'Final Solution'", back: "Hitler's plan to systematically murder every European Jew." },
          { front: "The Holocaust", back: "The mass genocide of Jews (and others) during WWII." },
        ],
        questions: [
          { type: "mc", q: "Appeasement was the policy of:", choices: ["giving in to Hitler's demands to avoid war", "bombing German cities", "isolating the U.S. from all wars", "rebuilding Europe"], answer: 0 },
          { type: "mc", q: "The Lend-Lease Act allowed the United States to:", choices: ["declare war on Japan", "send supplies and aid to the Allies without entering combat", "build the atomic bomb", "join the League of Nations"], answer: 1 },
          { type: "mc", q: "The 'Final Solution' refers to:", choices: ["the plan to end the Great Depression", "Hitler's plan to systematically murder European Jews", "the Treaty of Versailles", "the Marshall Plan"], answer: 1 },
        ],
      },

      /* 7. Cold War */
      {
        id: "his-coldwar",
        title: "The Cold War",
        blurb: "Superpowers, the Iron Curtain, containment, and the USSR's collapse.",
        lesson: [
          { defs: [
            ["Superpowers", "The **United States** and the **Soviet Union** after WWII."],
            ["Iron Curtain", "Churchill's term for the divide between Soviet-controlled Eastern Europe and the West."],
            ["Berlin Wall", "Built by East Germany to **stop citizens fleeing** to capitalist West Berlin."],
            ["Marshall Plan", "U.S. aid to rebuild Europe (Greece & Turkey aided to block Soviet influence)."],
            ["United Nations", "Post-WWII international **peacekeeping** body."],
            ["Berlin Airlift", "The **first major** U.S.–USSR confrontation of the Cold War."],
            ["Domino Theory", "Fear that if one nation fell to communism, neighbors would too — justified the **Vietnam** intervention."],
            ["Collapse of the USSR", "Gorbachev's **glasnost** (openness) & **perestroika** (restructuring) weakened control → collapse in **1991**."],
          ] },
          { tip: "**Glasnost** = openness, **Perestroika** = restructuring. Both unintentionally hastened the Soviet collapse (1991)." },
        ],
        visual: {
          type: "timeline", cap: "Cold War milestones",
          events: [
            { d: "After WWII", t: "U.S. & USSR become rival **superpowers**" },
            { d: "Iron Curtain", t: "Europe split East vs. West" },
            { d: "Berlin Airlift", t: "First major US–USSR confrontation" },
            { d: "Vietnam", t: "**Domino Theory** justifies intervention" },
            { d: "1991", t: "Glasnost + perestroika → **USSR collapses**" },
          ],
        },
        cards: [
          { front: "The two Cold War superpowers", back: "The United States and the Soviet Union." },
          { front: "Iron Curtain", back: "Churchill's term for the divide between Soviet East and democratic West." },
          { front: "Why was the Berlin Wall built?", back: "To stop East Germans from fleeing to capitalist West Berlin." },
          { front: "Marshall Plan", back: "U.S. financial aid to rebuild war-torn Europe (and block communism)." },
          { front: "Domino Theory", back: "If one nation fell to communism, its neighbors would too (justified Vietnam)." },
          { front: "Glasnost & perestroika", back: "Gorbachev's reforms (openness & restructuring) that led to the USSR's collapse in 1991." },
          { front: "Berlin Airlift", back: "The first major confrontation between the US and USSR." },
        ],
        questions: [
          { type: "mc", q: "The 'Iron Curtain' described:", choices: ["a new weapon", "the divide between Soviet-controlled East and the West", "a trade agreement", "the Berlin Airlift"], answer: 1 },
          { type: "mc", q: "The Berlin Wall was built to:", choices: ["defend against air raids", "stop East Germans from fleeing to West Berlin", "divide Korea", "house refugees"], answer: 1 },
          { type: "mc", q: "Gorbachev's reforms glasnost and perestroika led to:", choices: ["the start of WWII", "the collapse of the Soviet Union in 1991", "the building of the Berlin Wall", "the Marshall Plan"], answer: 1 },
          { type: "mc", q: "The Domino Theory was used to justify U.S. intervention in:", choices: ["Germany", "Vietnam", "Italy", "Egypt"], answer: 1 },
        ],
      },

      /* 8. Decolonization & modern conflicts */
      {
        id: "his-decolonization",
        title: "Decolonization & Modern Conflicts",
        blurb: "Partition of India, the Year of Africa, apartheid, and genocide.",
        lesson: [
          { defs: [
            ["Partition of India (1947)", "Britain split the region into **India and Pakistan** over Hindu–Muslim conflict."],
            ["'Year of Africa' (1960)", "**Seventeen** African nations gained independence in a single year."],
            ["Apartheid", "South Africa's system of **racial segregation and white-minority rule**."],
            ["Mandela & Gandhi", "Both used **nonviolent protest** against racial/imperial injustice."],
            ["Rwandan Genocide (1994)", "Hutu extremists mass-murdered the minority **Tutsi**."],
            ["Korean War", "Ended in a **stalemate at the 38th parallel**, leaving Korea permanently divided."],
          ] },
          { tip: "1947 = Partition of **India/Pakistan**. 1960 = **Year of Africa**. 1994 = **Rwandan Genocide**." },
        ],
        visual: {
          type: "timeline", cap: "Decolonization & after",
          events: [
            { d: "1947", t: "**Partition of India** into India & Pakistan" },
            { d: "1960", t: "**Year of Africa** — 17 nations freed" },
            { d: "20th c.", t: "**Apartheid** in South Africa (Mandela resists)" },
            { d: "1994", t: "**Rwandan Genocide** — Hutu vs. Tutsi" },
          ],
        },
        cards: [
          { front: "Partition of India (1947)", back: "Britain split the region into India and Pakistan (Hindu–Muslim conflict)." },
          { front: "'Year of Africa' (1960)", back: "Seventeen African nations gained independence in one year." },
          { front: "Apartheid", back: "South Africa's system of racial segregation and white-minority rule." },
          { front: "Mandela & Gandhi share what method?", back: "Nonviolent protest against injustice." },
          { front: "Rwandan Genocide (1994)", back: "Hutu extremists mass-murdered the minority Tutsi." },
          { front: "How did the Korean War end?", back: "A stalemate at the 38th parallel — a permanently divided Korea." },
        ],
        questions: [
          { type: "mc", q: "The 1947 Partition divided British India into:", choices: ["North and South Korea", "India and Pakistan", "Israel and Palestine", "East and West Germany"], answer: 1 },
          { type: "mc", q: "Apartheid was the system of racial segregation in:", choices: ["India", "South Africa", "Rwanda", "Vietnam"], answer: 1 },
          { type: "mc", q: "The 1994 Rwandan Genocide involved Hutu extremists targeting the:", choices: ["Tutsi minority", "British colonizers", "Boers", "Sepoys"], answer: 0 },
          { type: "mc", q: "The Korean War ended with:", choices: ["a total North Korean victory", "a stalemate near the 38th parallel", "Korean unification", "a Soviet takeover"], answer: 1 },
        ],
      },
    ],
  });
})(window.STUDY);
