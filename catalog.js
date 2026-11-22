/* Original metadata and study descriptions; no third-party translations reproduced. */
const SOURCE='https://www.gnosis.org/naghamm/nhl.html';
const WORKS=[
['The Prayer of the Apostle Paul','I','Prayer','A short devotional text preserved at the beginning of Codex I.'],
['The Apocryphon of James','I','Revelation','A dialogue presenting teachings attributed to the risen Jesus and transmitted to James and Peter.'],
['The Gospel of Truth','I','Knowledge','A poetic theological meditation on ignorance, revelation, and knowledge of the divine.'],
['The Treatise on the Resurrection','I','Resurrection','A letter addressing resurrection and its meaning for spiritual life.'],
['The Tripartite Tractate','I','Cosmology','An extensive theological account of divine emanation, disruption, and restoration.'],
['The Apocryphon of John','II, III, IV','Cosmology','A revelatory narrative of the divine realm, Sophia, the creator figure, and human origins.'],
['The Gospel of Thomas','II','Sayings','A collection of sayings attributed to Jesus, organized without a continuous narrative.'],
['The Gospel of Philip','II','Sacraments','A collection of reflections on names, images, ritual, and spiritual union.'],
['The Hypostasis of the Archons','II','Creation','A reinterpretation of Genesis centered on rulers, creation, and spiritual resistance.'],
['On the Origin of the World','II','Creation','An elaborate mythic account of cosmic beginnings and the emergence of worldly powers.'],
['The Exegesis on the Soul','II','Soul','An allegorical interpretation of the soul’s estrangement and restoration.'],
['The Book of Thomas the Contender','II','Dialogue','A dialogue on self-knowledge, embodied life, and spiritual discipline.'],
['The Gospel of the Egyptians','III, IV','Cosmology','A mythological work also known as the Holy Book of the Great Invisible Spirit.'],
['Eugnostos the Blessed','III, V','Cosmology','A theological exposition of the transcendent divine and emanated realities.'],
['The Sophia of Jesus Christ','III','Revelation','A post-resurrection dialogue adapting themes found in Eugnostos the Blessed.'],
['The Dialogue of the Savior','III','Dialogue','A conversation involving Jesus and disciples on insight, salvation, and spiritual practice.'],
['The Apocalypse of Paul','V','Revelation','A visionary account of ascent through heavenly realms.'],
['The First Apocalypse of James','V','Revelation','A revelatory dialogue addressing James, suffering, and passage beyond hostile powers.'],
['The Second Apocalypse of James','V','Revelation','A work depicting James’s teaching, witness, and death.'],
['The Apocalypse of Adam','V','Creation','Adam recounts revelations concerning human origins and future deliverance.'],
['The Acts of Peter and the Twelve Apostles','VI','Journey','An allegorical travel narrative featuring the apostles and a mysterious pearl merchant.'],
['The Thunder, Perfect Mind','VI','Poetry','A striking first-person poem of paradoxical declarations and contrasting identities.'],
['Authoritative Teaching','VI','Soul','An instructional text contrasting the soul’s vulnerability with spiritual insight.'],
['The Concept of Our Great Power','VI','Revelation','A mythic account of ages, conflict, and transformative revelation.'],
['Plato, Republic 588A–589B','VI','Philosophy','An adapted passage from Plato preserved within the Nag Hammadi collection.'],
['The Discourse on the Eighth and Ninth','VI','Hermetic','A Hermetic dialogue about spiritual ascent and contemplative knowledge.'],
['The Prayer of Thanksgiving','VI','Hermetic','A prayer of gratitude associated with Hermetic teachings.'],
['Asclepius 21–29','VI','Hermetic','An excerpt from the Hermetic Asclepius addressing the sacred world and humanity.'],
['The Paraphrase of Shem','VII','Cosmology','A lengthy revelatory narrative describing primordial realities and cosmic struggle.'],
['The Second Treatise of the Great Seth','VII','Revelation','A polemical revelatory text discussing identity, suffering, and appearances.'],
['Apocalypse of Peter','VII','Revelation','A visionary dialogue offering an alternative interpretation of crucifixion.'],
['The Teachings of Silvanus','VII','Wisdom','An ethical and philosophical instruction drawing on multiple ancient traditions.'],
['The Three Steles of Seth','VII','Prayer','Three hymnic compositions associated with Sethian contemplation.'],
['Zostrianos','VIII','Ascent','An extended visionary ascent through levels of transcendent reality.'],
['Melchizedek','IX','Revelation','A fragmentary text centered on Melchizedek and revelatory instruction.'],
['The Thought of Norea','IX','Prayer','A brief prayerful work invoking spiritual origins and deliverance.'],
['The Testimony of Truth','IX','Ethics','A critical text discussing knowledge, religious practice, and competing claims to truth.'],
['Marsanes','X','Ascent','A fragmentary revelation concerned with spiritual levels, names, and letters.'],
['The Interpretation of Knowledge','XI','Knowledge','A fragmentary discourse on communal relationships, teaching, and spiritual understanding.'],
['A Valentinian Exposition','XI','Cosmology','A fragmentary theological exposition associated with Valentinian themes.'],
['Allogenes','XI','Ascent','A visionary account of transcendent knowledge and contemplative ascent.'],
['Hypsiphrone','XI','Revelation','A short fragmentary revelation featuring a figure named Hypsiphrone.'],
['The Sentences of Sextus','XII','Wisdom','A collection of ethical maxims also known from transmission outside Nag Hammadi.'],
['The Gospel of Truth (fragment)','XII','Knowledge','A fragmentary additional witness to the work preserved more fully in Codex I.'],
['Fragments','XII','Fragment','Additional fragmentary material whose interpretation remains limited.'],
['Trimorphic Protennoia','XIII','Cosmology','A first-person revelation of divine Forethought in three forms.'],
['On the Origin of the World (fragment)','XIII','Creation','A fragmentary witness to a work also preserved in Codex II.']
].map(([title,codex,theme,summary],id)=>({id,title,codex,theme,summary,source:SOURCE}));
const CONCEPTS=[
{name:'Monad',subtitle:'The ultimate source',description:'A term used in modern discussion of some Gnostic cosmologies for the transcendent first principle. Terminology and metaphysics differ across ancient works.',related:['Barbelo','Pleroma']},
{name:'Barbelo',subtitle:'Divine emanation',description:'A prominent figure in several Sethian texts, often associated with the first thought or emanation of the invisible Spirit.',related:['Monad','Aeons']},
{name:'Aeons',subtitle:'Divine realities',description:'In several ancient Gnostic systems, aeons designate divine realities or emanations. Their names and order vary by tradition.',related:['Pleroma','Sophia']},
{name:'Pleroma',subtitle:'Fullness',description:'A term meaning fullness, used in some early Christian and Gnostic theological frameworks to discuss the divine realm.',related:['Aeons','Sophia']},
{name:'Sophia',subtitle:'Wisdom',description:'Wisdom appears in varied mythic roles, including accounts of cosmic disturbance and restoration. Do not assume one uniform story across texts.',related:['Demiurge','Pleroma']},
{name:'Demiurge',subtitle:'Creator figure',description:'A scholarly label for a subordinate creator figure in some cosmological narratives, though the texts use several specific names and descriptions.',related:['Sophia','Archons']},
{name:'Archons',subtitle:'Rulers',description:'Ruling powers featured in several mythic narratives, often associated with the structure and limitations of the material cosmos.',related:['Demiurge','Gnosis']},
{name:'Gnosis',subtitle:'Knowledge and insight',description:'A Greek term for knowledge, often used to describe transformative insight in modern scholarly discussion. Ancient texts present diverse paths to understanding.',related:['Archons','Monad']}
];

const STUDY_MODULES = [
  {
    id: 'thomas', title: 'Reading a saying', theme: 'Close reading', minutes: 12,
    overview: 'Compare the prologue and two sayings in a collection attributed to Jesus.',
    readings: [{
      work: 'The Gospel of Thomas', passage: 'Prologue and sayings 1–3',
      translator: 'Mark M. Mattison', url: 'https://www.gospels.net/thomas/',
      evidence: 'The prologue attributes the sayings to the living Jesus and their writing to Didymos Judas Thomas. Saying 1 connects interpreting the sayings to escaping death. Saying 3 locates the kingdom both inside and outside the hearers.'
    }],
    interpretation: 'The opening can be read as an invitation to practice interpretation. The relation between self-knowledge and the kingdom still needs to be argued from the sayings.',
    prompt: 'Compare sayings 1 and 3. What do they ask the hearer to do? Record one observation and one possible interpretation.',
    cards: [
      ['Who is said to have written down the sayings?', 'Didymos Judas Thomas, according to the prologue.', 0],
      ['Where does saying 3 locate the kingdom?', 'Inside and outside the hearers.', 0]
    ],
    questions: [
      ['Which passage links interpreting the sayings to escaping death?', ['The prologue', 'Saying 1', 'Saying 3'], 1, 'Saying 1 explicitly makes this connection.', 0],
      ['Which is an interpretation of the opening?', ['Thomas is named in the prologue.', 'Saying 3 refers to the kingdom.', 'The opening trains the reader in a practice of interpretation.'], 2, 'This describes a possible purpose inferred from the opening.', 0]
    ]
  },
  {
    id: 'james', title: 'Who receives the teaching?', theme: 'Narrative framing', minutes: 14,
    overview: 'Follow the movement from a private letter to a dialogue with the risen Savior.',
    readings: [{
      work: 'The Apocryphon of James', passage: 'Salutation, Prologue, and The Savior Appears (pp. 1–3)',
      translator: 'Samuel Zinner, edited by Mark M. Mattison',
      url: 'https://www.luminescence-llc.net/the-secret-book-of-james',
      evidence: 'The letter frames the work as a private transmission. In the narrated scene the Savior calls James and Peter apart from the others and speaks of filling them.'
    }],
    interpretation: 'The nested audiences may give the revelation authority by making its transmission selective. That is a reading of the literary frame.',
    prompt: 'Track who speaks, who hears, and who receives the writing. Where does the audience change?',
    cards: [
      ['Which two disciples are called apart?', 'James and Peter.', 0],
      ['What form frames the narrated dialogue?', 'A letter from James to a recipient whose name is missing in the surviving text.', 0]
    ],
    questions: [
      ['What are the twelve doing when the Savior appears?', ['Traveling to a city', 'Calling to mind his teachings and arranging them in books', 'Asking about the rulers of the cosmos'], 1, 'The opening scene describes the disciples recalling and arranging earlier teachings.', 0],
      ['Which detail comes directly from the frame?', ['The text depicts transmission to a particular recipient.', 'Every ancient reader joined the same community.', 'Secrecy was the only source of authority.'], 0, 'The prologue addresses an individual recipient and restricts circulation of the writing.', 0]
    ]
  },
  {
    id: 'thunder', title: 'The voice of paradox', theme: 'Poetry', minutes: 12,
    overview: 'Read the speaker’s paired identities and examine how they affect the poem.',
    readings: [{
      work: 'The Thunder, Perfect Mind', passage: 'Opening and first series of self-declarations (p. 13)',
      translator: 'Samuel Zinner, edited by Mark M. Mattison',
      url: 'https://www.luminescence-llc.net/thunder-perfect-mind',
      evidence: 'The speaker addresses hearers and applies opposing social descriptions to herself, including being honored and being scorned.'
    }],
    interpretation: 'The paired descriptions may unsettle the listener’s usual social categories. Identifying the speaker with a particular named figure would require further evidence.',
    prompt: 'Choose two pairs of descriptions. How does reading them aloud change your sense of the speaker?',
    cards: [
      ['What recurring grammatical form introduces the paired descriptions?', 'First-person self-declarations.', 0],
      ['Name a pair from the opening.', 'Honored and scorned is one example.', 0]
    ],
    questions: [
      ['Which feature is evident in the opening?', ['A list of heavenly rulers', 'A continuous biography', 'A speaker who uses opposing descriptions of herself'], 2, 'The opening repeatedly pairs descriptions that normally pull in different directions.', 0],
      ['Which claim requires an interpretive argument?', ['The speaker uses first-person language.', 'The speaker should be identified as a particular goddess.', 'The speaker addresses hearers.'], 1, 'The opening gives descriptions and addresses listeners. A specific identification calls for additional evidence.', 0]
    ]
  },
  {
    id: 'john', title: 'Sophia and the chief ruler', theme: 'Cosmology', minutes: 16,
    overview: 'Trace how the long version of John explains the ruler’s origin and claim to authority.',
    readings: [{
      work: 'The Apocryphon of John', passage: 'Long version, Codex II,1 (pp. 9–15)',
      translator: 'Michael Waldstein and Frederik Wisse',
      url: 'https://www.gnosis.org/naghamm/apocjn-long.html',
      alternate: 'https://thegnosticlibrary.com/texts/secret-book-of-john/',
      evidence: 'Sophia produces an offspring called Yaltabaoth. The narrator describes the ruler as ignorant of the source of his strength and depicts Sophia recognizing a deficiency and repenting.'
    }],
    interpretation: 'One reading sees dramatic irony in the gap between what the ruler claims and what the reader has learned about his origin.',
    prompt: 'Make two columns in your notes. Record what the ruler claims in one and what the narrative has told you about him in the other.',
    cards: [
      ['Who brings forth Yaltabaoth?', 'Sophia, in the long version studied here.', 0],
      ['What does the ruler misunderstand?', 'Where his strength came from.', 0]
    ],
    questions: [
      ['Who comes to recognize a deficiency and repent?', ['Sophia', 'John', 'Yaltabaoth'], 0, 'The passage describes the mother recognizing the deficiency and repenting.', 0],
      ['What supports the dramatic-irony reading?', ['Sophia and the ruler tell identical stories.', 'The narrator places the origin of the ruler’s strength beyond his own understanding.', 'John tells the reader nothing about the ruler’s origin.'], 1, 'The reader learns an origin that the ruler fails to understand.', 0]
    ]
  },
  {
    id: 'compare', title: 'Compare two voices', theme: 'Comparative reading', minutes: 15,
    overview: 'Compare how a sayings collection and a first-person poem address their readers.',
    readings: [
      {
        work: 'The Gospel of Thomas', passage: 'Prologue and sayings 1–2',
        translator: 'Mark M. Mattison', url: 'https://www.gospels.net/thomas/',
        evidence: 'The prologue frames the work as sayings spoken by Jesus. The first sayings speak of interpretation and seeking.'
      },
      {
        work: 'The Thunder, Perfect Mind', passage: 'Opening address (p. 13)',
        translator: 'Samuel Zinner, edited by Mark M. Mattison',
        url: 'https://www.luminescence-llc.net/thunder-perfect-mind',
        evidence: 'The speaker describes being found by those who seek her and calls her hearers to attend to her.'
      }
    ],
    interpretation: 'Seeking is a useful point of comparison. Its function may change when it appears in an attributed saying or in a poem voiced by the one being sought.',
    prompt: 'Write a comparison using one detail from each text. Explain what each passage adds to your claim.',
    cards: [
      ['Which reading frames itself as a collection of sayings?', 'The Gospel of Thomas.', 0],
      ['Which speaker describes being found by those who seek her?', 'The speaker of Thunder, Perfect Mind.', 1]
    ],
    questions: [
      ['Which detail supports comparing the passages?', ['Both have language of seeking.', 'Both tell Sophia’s story.', 'Both name James as the recipient.'], 0, 'Saying 2 and the opening address in Thunder both use the language of seeking.', 0],
      ['Which comparison is best supported?', ['The two voices are certainly the same historical person.', 'Each uses a different literary form to address its audience.', 'The passages prove the texts were composed together.'], 1, 'Thomas frames attributed sayings; Thunder presents an address in the first person.', 1]
    ]
  }
];

for (const reading of STUDY_MODULES.flatMap(module => module.readings)) {
  WORKS.find(work => work.title === reading.work).source = reading.url;
}
