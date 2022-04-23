BEGIN TRANSACTION;

INSERT INTO users (id, login, password, email, activation_code, is_activated, is_native, is_admin, last_active_time) VALUES
 (1,'admin','$2b$10$5.DxSmB19Bh86KyryAZo7.2GT9eDRm3VgFCMye6Wm/p0HzsYAI2ru','admin@trash-mail.com',NULL,1,1,1,NULL),
 (2,'ola','234','ola@example.com','12',1,1,0,20220305),
 (3,'ela','322','ela@mail.com','29',1,1,0,20220306),
 (4,'franek','964','franek@example.com','68',72,1,0,20220301),
 (5,'gocha','954','gocha@torun.pol','65',93,1,0,20220309);

 INSERT INTO anons (id, title, description, category, images, author_id, create_date, lat, lng, type, coat, color, breed, is_active) VALUES
 (1,'Zaginął kot','Kot rasy egipskiej, czarny, nagroda za znalezienie - kot dachowy',3,'',3,20220302,21.0,56.0,'1','','','',0),
 (2,'Pie żre kiełbasę','Kto to widział, żeby wędliny marnować',2,'',2,20220304,56.0,85.0,'2','','','',0),
 (3,'Papuga uciekła','Ara zielona zwiała i nie chce wracać, ktoś widział?',3,'',3,20220307,16.0,43.0,'3',NULL,NULL,NULL,0);

 INSERT INTO ChatUsers (anons_id, chat_id, user_id, last_seen_time) VALUES
 (1,4,3,NULL),
 (1,4,4,NULL),
 (1,5,3,NULL),
 (1,5,5,NULL),
 (2,3,2,NULL),
 (2,3,3,NULL),
 (3,6,3,NULL),
 (3,6,5,NULL);

INSERT INTO ChatMessages (message_id, chat_id, user_id, message_date, message_text) VALUES
 (1,4,4,20220301,'ala ma kota'),
 (2,4,3,20220301,'czy to ten moj kot?'),
 (3,4,4,20220301,'tego nie wiem ale jest podejrzenie'),
 (4,4,4,20220301,'możesz pojechać i sprawdzić'),
 (5,4,3,20220302,'dobra, dziś jade sprawdzić'),
 (6,3,3,20220305,'nie wiadomo, co to za kiełbasa'),
 (7,3,2,20220305,'dobra, śląska'),
 (8,3,3,20220306,'psu należy się kiełbasa jak psu kiełbasa'),
 (9,5,5,20220308,'odejwij sie, to pogadamy'),
 (10,6,5,20220309,'widziałem twoją kozę, pasie się na łące u sąsiada'),
 (11,4,4,20220308,'okazało sie, że fela też ma kota');

 COMMIT;
