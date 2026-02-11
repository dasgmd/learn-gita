-- ==========================================
-- Seed Vaishnava Festivals for 2026
-- Run this in Supabase SQL Editor (once)
-- ==========================================
-- NOTE: Uses existing 'festivals' table with columns: id, name, date, description, significance, fast_type, created_at

-- Clean up existing 2026 data to avoid duplicates if you run this twice
DELETE FROM festivals WHERE date >= '2026-01-01' AND date <= '2026-12-31';

-- Insert all festivals
INSERT INTO festivals (name, date, description, significance, fast_type) VALUES
-- January
('Sri Krsna Pusya Abhiseka', '2026-01-03', 'Festival', 'Bathing ceremony of Lord Krishna with pure milk and other auspicious items during Pusya Nakshatra.', 'none'),
('Sri Ramacandra Kaviraja -- Disappearance', '2026-01-07', 'Disappearance Day', 'Disappearance day of Sri Ramacandra Kaviraja, a great Vaishnava poet.', 'none'),
('Srila Gopala Bhatta Gosvami -- Appearance', '2026-01-07', 'Appearance Day', 'Appearance day of one of the Six Gosvamis of Vrindavana.', 'none'),
('Sri Jayadeva Gosvami -- Disappearance', '2026-01-08', 'Disappearance Day', 'Author of the famous Gita Govinda.', 'none'),
('Sri Locana Dasa Thakura -- Disappearance', '2026-01-09', 'Disappearance Day', 'Author of Sri Chaitanya Mangala.', 'none'),
('Sat-tila Ekadasi', '2026-01-14', 'Fasting Day', 'Ekadasi dedicated to Lord Vishnu with sesame seeds offerings.', 'grains'),
('Break fast 07:10 - 10:42 (Sat-tila Ekadasi Parana)', '2026-01-15', 'Ekadasi Parana', 'Break fast window for Sat-tila Ekadasi.', 'none'),
('Ganga Sagara Mela', '2026-01-15', 'Festival', 'Sacred pilgrimage at the confluence of Ganga and the ocean.', 'none'),
('Vasanta Pancami', '2026-01-23', 'Festival', 'Beginning of spring season. Worship of Sarasvati Devi.', 'none'),
('Srimati Visnupriya Devi -- Appearance', '2026-01-23', 'Appearance Day', 'Appearance of the eternal consort of Sri Caitanya Mahaprabhu.', 'none'),
('Srila Visvanatha Cakravarti Thakura -- Disappearance', '2026-01-23', 'Disappearance Day', 'Great acarya and commentator on Srimad Bhagavatam.', 'none'),
('Sri Pundarika Vidyanidhi -- Appearance', '2026-01-23', 'Appearance Day', 'Godbrother of Svarupa Damodara and spiritual master of Gadadhara Pandita.', 'none'),
('Sri Raghunandana Thakura -- Appearance', '2026-01-23', 'Appearance Day', 'Son of Mukunda Dasa, known for his intense devotion.', 'none'),
('Srila Raghunatha Dasa Gosvami -- Appearance', '2026-01-23', 'Appearance Day', 'One of the Six Gosvamis, the prayojana-acarya.', 'none'),
('Sarasvati Puja', '2026-01-23', 'Festival', 'Worship of Goddess Sarasvati, the deity of learning.', 'none'),
('Sri Advaita Acarya -- Appearance', '2026-01-25', 'Appearance Day', 'Appearance of Sri Advaita Acarya whose call brought Lord Caitanya to earth.', 'partial'),
('Bhismastami', '2026-01-26', 'Festival', 'Appearance day of Grandfather Bhisma from Mahabharata.', 'none'),
('Sri Madhvacarya -- Disappearance', '2026-01-27', 'Disappearance Day', 'Founder of the Brahma-Madhva-Gaudiya sampradaya.', 'none'),
('Sri Ramanujacarya -- Disappearance', '2026-01-28', 'Disappearance Day', 'Great Vaishnava acarya of the Sri sampradaya.', 'none'),
('Bhaimi Ekadasi', '2026-01-29', 'Fasting Day', 'Also fast till noon for Varahadeva.', 'grains'),
('Break fast 07:06 - 10:43 (Bhaimi Ekadasi Parana)', '2026-01-30', 'Ekadasi Parana', 'Break fast window for Bhaimi Ekadasi.', 'none'),
('Varaha Dvadasi: Appearance of Lord Varahadeva', '2026-01-30', 'Appearance Day', 'Appearance of Lord Varaha, the boar incarnation who rescued Mother Earth.', 'none'),
('Nityananda Trayodasi: Appearance of Sri Nityananda Prabhu', '2026-01-31', 'Appearance Day', 'Appearance of Lord Nityananda, the most merciful incarnation of Balarama.', 'partial'),

-- February
('Sri Krsna Madhura Utsava', '2026-02-01', 'Festival', 'Celebration of Lord Krishna''s sweet pastimes.', 'none'),
('Srila Narottama Dasa Thakura -- Appearance', '2026-02-01', 'Appearance Day', 'Appearance of the great Vaishnava poet and acarya.', 'none'),
('Srila Bhaktisiddhanta Sarasvati Thakura -- Appearance', '2026-02-06', 'Appearance Day', 'Appearance of Srila Prabhupada''s spiritual master, the lion guru.', 'partial'),
('Sri Purusottama Das Thakura -- Disappearance', '2026-02-06', 'Disappearance Day', 'Associate of Lord Caitanya.', 'none'),
('Vijaya Ekadasi', '2026-02-13', 'Fasting Day', 'Ekadasi that grants victory over material desires.', 'grains'),
('Break fast 06:57 - 10:41 (Vijaya Ekadasi Parana)', '2026-02-14', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Sri Isvara Puri -- Disappearance', '2026-02-14', 'Disappearance Day', 'Spiritual master of Sri Caitanya Mahaprabhu.', 'none'),
('Siva Ratri', '2026-02-16', 'Festival', 'Night dedicated to Lord Shiva, the greatest Vaishnava.', 'none'),
('Srila Jagannatha Dasa Babaji -- Disappearance', '2026-02-18', 'Disappearance Day', 'The great babaji who confirmed the birthplace of Lord Caitanya.', 'none'),
('Sri Rasikananda -- Disappearance', '2026-02-18', 'Disappearance Day', 'Important disciple of Syamananda Prabhu.', 'none'),
('Sri Purusottama Dasa Thakura -- Appearance', '2026-02-21', 'Appearance Day', 'Associate of Lord Caitanya.', 'none'),
('Amalaki Vrata Ekadasi', '2026-02-27', 'Fasting Day', 'Sacred Ekadasi associated with the Amalaki tree.', 'grains'),
('Break fast 06:44 - 10:36 (Amalaki Ekadasi Parana)', '2026-02-28', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Sri Madhavendra Puri -- Disappearance', '2026-02-28', 'Disappearance Day', 'The root of the tree of pure devotional service in the Gaudiya tradition.', 'none'),

-- March
('Gaura Purnima: Appearance of Sri Caitanya Mahaprabhu', '2026-03-03', 'Major Festival', 'The most auspicious day — appearance of the Golden Avatar who spread the Holy Name.', 'waterless'),
('Festival of Jagannatha Misra', '2026-03-04', 'Festival', 'Celebration by the father of Sri Caitanya Mahaprabhu.', 'none'),
('Sri Srivasa Pandita -- Appearance', '2026-03-11', 'Appearance Day', 'Head of the Panca-tattva, in whose courtyard the sankirtan movement began.', 'none'),
('Papamocani Ekadasi', '2026-03-15', 'Fasting Day', 'Ekadasi that destroys all sins.', 'grains'),
('Break fast 06:27 - 09:43 (Papamocani Ekadasi Parana)', '2026-03-16', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Sri Govinda Ghosh -- Disappearance', '2026-03-16', 'Disappearance Day', 'Renowned kirtan singer and associate of Lord Caitanya.', 'none'),
('Sri Ramanujacarya -- Appearance', '2026-03-23', 'Appearance Day', 'Appearance of the great Vaishnava philosopher-acarya.', 'none'),
('Rama Navami: Appearance of Lord Sri Ramacandra', '2026-03-27', 'Major Festival', 'Appearance of the Supreme Lord as the ideal king, Maryada Purushottam.', 'partial'),
('Kamada Ekadasi', '2026-03-29', 'Fasting Day', 'Ekadasi that fulfills desires.', 'grains'),
('Break fast 06:12 - 07:12 (Kamada Ekadasi Parana)', '2026-03-30', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Damanakaropana Dvadasi', '2026-03-30', 'Festival', 'Festival of planting Damanaka creepers for Lord Krishna.', 'none'),

-- April
('Sri Balarama Rasayatra', '2026-04-02', 'Festival', 'Rasa dance pastimes of Lord Balarama.', 'none'),
('Sri Abhirama Thakura -- Disappearance', '2026-04-09', 'Disappearance Day', 'Powerful associate of Lord Nityananda.', 'none'),
('Srila Vrndavana Dasa Thakura -- Disappearance', '2026-04-12', 'Disappearance Day', 'Author of Sri Caitanya Bhagavata, the Vyasa of Caitanya lila.', 'none'),
('Varuthini Ekadasi', '2026-04-13', 'Fasting Day', 'Ekadasi that protects the devotee.', 'grains'),
('Break fast 06:57 - 10:11 (Varuthini Ekadasi Parana)', '2026-04-14', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Aksaya Trtiya — Candana Yatra Starts', '2026-04-20', 'Festival', 'Auspicious day for new beginnings. Start of Candana Yatra.', 'none'),
('Srimati Sita Devi -- Appearance', '2026-04-25', 'Appearance Day', 'Appearance of the eternal consort of Lord Ramacandra.', 'none'),
('Mohini Ekadasi', '2026-04-27', 'Fasting Day', 'Ekadasi named after Lord Vishnu''s Mohini form.', 'grains'),
('Break fast 05:42 - 10:05 (Mohini Ekadasi Parana)', '2026-04-28', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Nrsimha Caturdasi: Appearance of Lord Nrsimhadeva', '2026-04-30', 'Major Festival', 'Appearance of the half-man half-lion incarnation who protected His devotee Prahlada.', 'partial'),

-- May
('Sri Sri Radha-Ramana Devaji -- Appearance', '2026-05-01', 'Appearance Day', 'Self-manifested Deity worshipped by Gopala Bhatta Gosvami.', 'none'),
('Sri Ramananda Raya -- Disappearance', '2026-05-07', 'Disappearance Day', 'Sri Caitanya Mahaprabhu''s most confidential associate for discussing rasa-tattva.', 'none'),
('Apara Ekadasi', '2026-05-13', 'Fasting Day', 'Ekadasi that cannot be equaled.', 'grains'),
('Break fast 05:31 - 10:00 (Apara Ekadasi Parana)', '2026-05-14', 'Ekadasi Parana', 'Break fast window.', 'none'),

-- June
('Pandava Nirjala Ekadasi', '2026-06-26', 'Major Fasting', 'The most austere Ekadasi — complete waterless fast observed by Bhimasena.', 'waterless'),
('Break fast 05:25 - 10:03 (Nirjala Ekadasi Parana)', '2026-06-27', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Snana Yatra', '2026-06-29', 'Festival', 'Grand bathing ceremony of Lord Jagannatha.', 'none'),

-- July
('Yogini Ekadasi', '2026-07-11', 'Fasting Day', 'Ekadasi observed during Yogini.', 'grains'),
('Break fast 05:31 - 10:07 (Yogini Ekadasi Parana)', '2026-07-12', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Srila Bhaktivinoda Thakura -- Disappearance', '2026-07-14', 'Disappearance Day', 'Pioneer of the Hare Krishna movement in the modern age.', 'partial'),
('Ratha Yatra', '2026-07-16', 'Major Festival', 'Grand chariot festival of Lord Jagannatha, Baladeva, and Subhadra.', 'none'),
('Sayana Ekadasi', '2026-07-25', 'Fasting Day', 'Beginning of Caturmasya.', 'grains'),
('Break fast 05:39 - 10:10 (Sayana Ekadasi Parana)', '2026-07-26', 'Ekadasi Parana', 'Break fast window.', 'none'),
('Guru (Vyasa) Purnima', '2026-07-29', 'Major Day', 'Day to honour the spiritual master. Also disappearance of Srila Sanatana Gosvami.', 'none'),

-- August
('Kamika Ekadasi', '2026-08-09', 'Fasting Day', 'Ekadasi during the dark fortnight of Sravana.', 'grains'),
('Pavitraropana Ekadasi / Srila Rupa Gosvami -- Disappearance', '2026-08-24', 'Major Day', 'Sacred Ekadasi and disappearance of the rasacarya of Gaudiya Vaishnavism.', 'grains'),
('Lord Balarama -- Appearance', '2026-08-28', 'Major Festival', 'Appearance of Lord Balarama, the first expansion of the Supreme Lord.', 'partial'),

-- September
('Sri Krsna Janmastami: Appearance of Lord Sri Krsna', '2026-09-04', 'Highest Festival', 'The most auspicious day — appearance of the Supreme Personality of Godhead, Sri Krishna.', 'waterless'),
('Srila Prabhupada -- Appearance', '2026-09-05', 'Appearance Day', 'Appearance of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Founder-Acarya of ISKCON.', 'partial'),
('Annada Ekadasi', '2026-09-07', 'Fasting Day', 'Ekadasi that grants food and sustenance.', 'grains'),
('Radhastami: Appearance of Srimati Radharani', '2026-09-19', 'Major Festival', 'Appearance of the Supreme Goddess, the pleasure potency of Lord Krishna.', 'partial'),
('Parsva Ekadasi', '2026-09-22', 'Fasting Day', 'Also fast till noon for Vamanadeva.', 'grains'),
('Sri Vamana Dvadasi / Srila Jiva Gosvami -- Appearance', '2026-09-23', 'Major Day', 'Appearance of Lord Vamana and the greatest philosopher among the Six Gosvamis.', 'none'),
('Srila Bhaktivinoda Thakura -- Appearance', '2026-09-24', 'Appearance Day', 'Appearance of the pioneer acarya of modern Krishna consciousness.', 'partial'),
('Srila Haridasa Thakura -- Disappearance', '2026-09-25', 'Disappearance Day', 'Namacarya — the master teacher of chanting the Holy Name.', 'none'),

-- October
('Indira Ekadasi', '2026-10-06', 'Fasting Day', 'Ekadasi that can liberate forefathers from hellish conditions.', 'grains'),
('Pasankusa Ekadasi', '2026-10-22', 'Fasting Day', 'Ekadasi named after the goad of Lord Vishnu.', 'grains'),
('Srila Narottama Dasa Thakura -- Disappearance', '2026-10-30', 'Disappearance Day', 'Great Vaishnava acarya, singer, and poet.', 'none'),

-- November
('Rama Ekadasi', '2026-11-05', 'Fasting Day', 'Ekadasi bestowing the mercy of Lord Rama.', 'grains'),
('Govardhana Puja', '2026-11-10', 'Major Festival', 'Worship of Govardhana Hill, lifted by Lord Krishna to protect the Vrajavasis.', 'none'),
('Srila Prabhupada -- Disappearance', '2026-11-13', 'Disappearance Day', 'Disappearance of Srila Prabhupada, Founder-Acarya of ISKCON.', 'partial'),
('Utthana Ekadasi / Srila Gaura Kisora Dasa Babaji -- Disappearance', '2026-11-21', 'Major Day', 'End of Caturmasya. Disappearance of the spiritual master of Srila Bhaktisiddhanta Sarasvati.', 'grains'),

-- December
('Utpanna Ekadasi', '2026-12-04', 'Fasting Day', 'The Ekadasi that originated all other Ekadasis.', 'grains'),
('Moksada Ekadasi / Gita Jayanti', '2026-12-20', 'Gita Jayanti', 'Anniversary of Lord Krishna speaking the Bhagavad-gita to Arjuna on the battlefield of Kurukshetra.', 'grains'),
('Srila Bhaktisiddhanta Sarasvati Thakura -- Disappearance', '2026-12-27', 'Disappearance Day', 'Disappearance of the lion guru, Srila Prabhupada''s spiritual master.', 'partial');
