-- Quick re-seed for Billy Bass API
-- This will clear and repopulate all data

-- Clear existing data
DELETE FROM product_orders;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM users;

-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name IN ('users', 'products', 'orders', 'product_orders');

-- Seed Users
INSERT INTO users (email, password) VALUES 
  ('cody@email.com', '123'),
  ('murphy@email.com', '123');

-- Seed Products (All 16 Billy Bass variants)
INSERT INTO products (name, image, description, price, inventory, year, songs, stripe) VALUES 
  ('Big Mouth Billy Bass The Singing Sensation', 'https://i.ebayimg.com/images/g/JQ4AAOSw2w5gDO6t/s-l500.jpg', 'The original singing fish!', 9.99, 26, 1998, 'Take Me To The River, Don''t Worry Be Happy', 'price_1LqiVwLVr6OUxlRlXarYijRo'),
  
  ('Big Mouth Billy Bass Sings For The Holidays V1', 'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg', 'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.', 9.99, 26, 1999, 'Blues version of Twas The Night Before Christmas (which is a parody of Trouble by Elvis Presley)', 'price_1LqiW9LVr6OUxlRlJkfcX62N'),
  
  ('Big Mouth Billy Bass Sings For The Holidays V2', 'https://i.etsystatic.com/12164314/r/il/689569/3331563655/il_fullxfull.3331563655_bmk6.jpg', 'A Christmas themed version of Billy Bass. He wears a Santa hat and has a small jingle bell wrapped around his tail.', 9.99, 26, 2000, 'Country versions of Jingle Bells and Up On A Housetop', 'price_1LqiWPLVr6OUxlRlrPqJ0FRz'),
  
  ('World Record Billy Bass', 'https://preview.redd.it/rky092pjpus81.jpg?auto=webp&s=c30389666215ab466555a2fae51eb4b8d7f68a46', 'A giant 28" lunker singing fish sold exclusively at KayBee Toys. The fish comes with an extra nameplate that reads "WORLD RECORD BILLY BASS" that can be placed via peel off tape over the existing "BIG MOUTH BILLY BASS" nameplate.', 9.99, 26, 2000, 'Take Me To The River, Don''t Worry Be Happy', 'price_1LqiWcLVr6OUxlRlwZ7nawjX'),
  
  ('Big Mouth Billy Bones', 'https://image.invaluable.com/housePhotos/onesourceauctions/41/710741/H4367-L270358642_original.jpg', 'A singing skeleton fish made for Halloween. Billy Bones appears to be the deceased brother of Billy Bass. His bones also glow in the dark.', 9.99, 26, 2000, 'Bad To The Bone', 'price_1LqiWlLVr6OUxlRl3JgqBl4l'),
  
  ('Big Mouth Billy Bass Musical Keychain', 'https://live.staticflickr.com/5578/30110040924_656944327e_b.jpg', 'A very small static version of Billy Bass that is attached to a clip. This version lacks a plaque and doesn''t have movement. You activate him by pressing a small button near his tail.', 9.99, 26, 2000, 'Take Me To The River, Don''t Worry Be Happy', 'price_1LqiWzLVr6OUxlRlPUzF5mJU'),
  
  ('Big Mouth Billy Bass Cupholder', 'https://i.ytimg.com/vi/C5GRaGxEdD8/maxresdefault.jpg', 'The mouth is hollow so it can hold your drinking cup. It can be activated by squeezing the lower half of the head.', 9.99, 26, 2000, 'Take Me To The River, Don''t Worry Be Happy', 'price_1LqiXPLVr6OUxlRltifWwAUh'),
  
  ('Big Mouth Billy Bass Superstar', 'https://i.ytimg.com/vi/_T4EMOLOaqk/maxresdefault.jpg', 'A special edition of Billy Bass. He stands on his tail on a stage (Black round base) and holds a microphone. He taps his tail, sways his body and sings into the microphone.', 9.99, 26, 2001, 'Act Naturally and a parody of I Will Survive', 'price_1LqiXbLVr6OUxlRlJtSHbsJk'),
  
  ('Big Mouth Billy Bass Jr', 'https://m.media-amazon.com/images/I/81Jv9zcaCyL.jpg', 'A smaller version of Billy Bass on an oval plaque. Made for Billy''s 5th birthday.', 9.99, 26, 2004, 'parody of I Will Survive and Take Me To The River', 'price_1LqiXoLVr6OUxlRlbRCAaCPw'),
  
  ('Mini Big Mouth Billy Bass REC+PLAY', 'https://i.ytimg.com/vi/xBQ0Ts0mcVs/hqdefault.jpg', 'A miniature version of Billy Bass released sold at CVS and Cabela''s. Made for Billy''s 10th birthday. This version is very fragile and known to break easily.', 9.99, 26, 2009, 'Recorded message (up to 9 seconds) and Take Me To The River', 'price_1LqiY3LVr6OUxlRlPs9axvYl'),
  
  ('Big Mouth Billy Bass 15th Anniversary Edition', 'https://m.media-amazon.com/images/I/518lEEAIw3L._AC_SY350_.jpg', 'Billy is mounted on an oval shaped plaque and has a shiny nameplate with his name and logo. Made for Billy''s 15th birthday.', 9.99, 26, 2014, 'Don''t Worry Be Happy and a parody of I Will Survive', 'price_1LqiYELVr6OUxlRlDw34J6te'),
  
  ('Big Mouth Billy Bones 15th Anniversary Edition', 'https://m.media-amazon.com/images/I/91lXCI9skmL.jpg', 'This Billy Bones is mounted on a black oval shaped plaque, has red LEDs on his eyes and mouth, and lacks a nameplate.', 9.99, 26, 2015, 'Bad To The Bone', 'price_1LqiYSLVr6OUxlRlKUsdjd4s'),
  
  ('Big Mouth Billy Bass 15th Anniversary Christmas Edition', 'https://m.media-amazon.com/images/I/81V0p-7sGdL.jpg', 'This Billy Bones wears a Santa hat.', 9.99, 26, 2015, 'Billy Bass themed parody of Jingle Bells and a parody of I Will Survive', 'price_1LqiYeLVr6OUxlRluTJKJbSN'),
  
  ('Big Mouth Billy Bass Survivor Edition', 'https://m.media-amazon.com/images/I/91dEsfDo+ZL.jpg', 'Sold exclusively at Cracker Barrel, now with improved movements.', 9.99, 26, 2018, 'Parody of I Will Survive and Dont Worry Be Happy', 'price_1LqiYoLVr6OUxlRlhaqwPdfW'),
  
  ('Big Mouth Billy Bass The Speaking Sensation', 'https://cdn.thenewstack.io/media/2016/11/vtg-gemmy-big-mouth-billy-bass-singing-sensation-fish-2-songs-new-in-opened-box-3a78e94f60e7c847cabb27df4419a148-1024x687.jpg', 'A special version of Billy Bass that is compatible with Alexa via Bluetooth to an Amazon Echo device. He moves his mouth in sync with Alexa''s voice, turns his head outward when saying the wake word,and dances to music.', 9.99, 26, 2018, 'exclusive song called Fishin'' Time', 'price_1LqiZ2LVr6OUxlRlAyXG0OhL'),
  
  ('Classic Plaque Big Mouth Billy Bass', 'https://m.media-amazon.com/images/I/A1JcVUjNOwL.jpg', 'Features classic plaque design.', 9.99, 26, 2021, 'Take Me to the River and Huntin'', Fishin'', and Lovin'' Every Day', 'price_1LqiZALVr6OUxlRlgI4OPXYP');

-- Seed Orders
INSERT INTO orders (user_id) VALUES (1);

-- Seed Product Orders (junction table)
INSERT INTO product_orders (productId, orderId, quantity) VALUES (2, 1, 3);