
import React from 'react';
import { Course, SadhnaItem } from './types';

export const COURSES: Course[] = [
  {
    id: 'gita-101',
    title: 'Gita Essentials',
    description: 'A foundational journey through the 18 chapters of the Bhagavad Gita.',
    level: 'Beginner',
    duration: '8 Weeks',
    image: 'https://picsum.photos/seed/gita1/800/600',
    lessons: [
      {
        id: 'l1',
        title: 'Introduction to the Soul',
        hindiTitle: 'आत्मा का परिचय',
        videoUrl: 'https://www.youtube.com/embed/S_8qvefM9_0',
        shloka: {
          sanskrit: 'dehino ’smin yathā dehe kaumāraṁ yauvanaṁ jarā | tathā dehāntara-prāptir dhīras tatra na muhyati ||',
          translation: 'As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.',
          hindiTranslation: 'जैसे इस देह में देही (आत्मा) की कुमार, युवा और वृद्ध अवस्था होती है, वैसे ही अन्य शरीर की प्राप्ति होती है; धीर पुरुष उसमें मोहित नहीं होता।'
        },
        content: 'In this lesson, we explore the fundamental concept of the Bhagavad Gita: the distinction between the body and the soul. Krishna begins His instructions to Arjuna by explaining that while the body is temporary, the spark of life within is eternal.',
        hindiContent: 'इस पाठ में, हम भगवद गीता की मूल अवधारणा का पता लगाते हैं: शरीर और आत्मा के बीच का अंतर। कृष्ण अर्जुन को अपना उपदेश यह समझाते हुए शुरू करते हैं कि शरीर अस्थायी है, जबकि भीतर का जीवन शाश्वत है।'
      },
      {
        id: 'l2',
        title: 'The Nature of Duty',
        hindiTitle: 'कर्तव्य की प्रकृति',
        videoUrl: 'https://www.youtube.com/embed/nU1p9lE0XpQ',
        shloka: {
          sanskrit: 'karmaṇy-evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi ||',
          translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
          hindiTranslation: 'तुझे कर्म करने का ही अधिकार है, उसके फलों में कभी नहीं; इसलिए तू कर्मों के फल का हेतु मत हो और तेरी अकर्म में भी आसक्ति न हो।'
        },
        content: 'Duty (Dharma) is not just a social obligation but a spiritual path. Krishna teaches Arjuna that doing ones duty without attachment to the outcome is the key to freedom from anxiety.',
        hindiContent: 'कर्तव्य (धर्म) केवल एक सामाजिक दायित्व नहीं बल्कि एक आध्यात्मिक मार्ग है। कृष्ण अर्जुन को सिखाते हैं कि परिणाम के प्रति आसक्ति के बिना अपना कर्तव्य करना चिंता से मुक्ति की कुंजी है।'
      }
    ]
  },
  {
    id: 'karma-yoga',
    title: 'The Art of Karma Yoga',
    description: 'Learn how to transform daily work into a spiritual offering.',
    level: 'Intermediate',
    duration: '4 Weeks',
    image: 'https://picsum.photos/seed/gita2/800/600',
    lessons: [
      {
        id: 'k1',
        title: 'Sacrifice as Service',
        hindiTitle: 'सेवा के रूप में यज्ञ',
        videoUrl: 'https://www.youtube.com/embed/XmE9f82K6o8',
        content: 'Karma Yoga is the bridge between the mundane and the divine. By offering our work to the Supreme, we purify our hearts.',
        hindiContent: 'कर्म योग सांसारिक और दिव्य के बीच का पुल है। अपने काम को परमात्मा को समर्पित करके, हम अपने हृदय को शुद्ध करते हैं।'
      }
    ]
  },
  {
    id: 'bhakti-wisdom',
    title: 'Path of Devotion',
    description: 'Deep dive into the middle six chapters focusing on Bhakti Yoga.',
    level: 'Advanced',
    duration: '12 Weeks',
    image: 'https://picsum.photos/seed/gita3/800/600',
    lessons: [
      {
        id: 'b1',
        title: 'Pure Devotion',
        hindiTitle: 'शुद्ध भक्ति',
        videoUrl: 'https://www.youtube.com/embed/qf-2zQ0fG9Y',
        content: 'Bhakti is the highest yoga. It is the natural culmination of knowledge and action into love.',
        hindiContent: 'भक्ति सर्वोच्च योग है। यह ज्ञान और कर्म का प्रेम में स्वाभाविक समापन है।'
      }
    ]
  }
];

export const INITIAL_SADHNA: SadhnaItem[] = [
  { id: 'japa', label: 'Mantra Meditation (Japa)', completed: false, target: 16, current: 0, unit: 'rounds' },
  { id: 'reading', label: 'Gita Reading', completed: false, target: 15, current: 0, unit: 'minutes' },
  { id: 'shloka', label: 'Verse Memorization', completed: false, target: 1, current: 0, unit: 'verse' },
  { id: 'yoga', label: 'Hatha Yoga', completed: false, target: 30, current: 0, unit: 'minutes' }
];

export const ICONS = {
  Feather: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
  ),
  Lotus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 12h14"/><path d="m7.5 7.5 9 9"/><path d="m7.5 16.5 9-9"/></svg>
  ),
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  )
};
