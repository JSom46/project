BEGIN TRANSACTION;
DROP TABLE IF EXISTS "anons";
CREATE TABLE IF NOT EXISTS "anons" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"category"	INTEGER NOT NULL,
	"images"	TEXT,
	"author_id"	INTEGER NOT NULL,
	"create_date"	INTEGER NOT NULL,
	"lat"	REAL NOT NULL,
	"lng"	REAL NOT NULL,
	"type"	TEXT NOT NULL,
	"coat"	TEXT,
	"color"	TEXT,
	"breed"	TEXT,
	"is_active"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "notifications";
CREATE TABLE IF NOT EXISTS "notifications" (
	"id"	INTEGER,
	"anon_id"	INTEGER NOT NULL,
	"image"	TEXT,
	"lat"	REAL NOT NULL,
	"lng"	REAL NOT NULL,
	"is_new"	INTEGER,
	"create_date"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "ChatImages";
CREATE TABLE IF NOT EXISTS "Images" (
	"image_id"	INT,
	"message_id"	INT,
	"user_id"	INT,
	"path"	TEXT,
	"type"	TEXT,
	CONSTRAINT "Images_ms_id" FOREIGN KEY("message_id") REFERENCES "ChatMessages"("message_id"),
	PRIMARY KEY("image_id")
);
DROP TABLE IF EXISTS "ChatMessages";
CREATE TABLE IF NOT EXISTS "ChatMessages" (
	"message_id"	INT,
	"anons_id"	INT,
	"chat_id"	INTEGER,
	"user_id"	INT,
	"message_date"	INT,
	"message_text"	TEXT,
	CONSTRAINT "chat_messages_fk_user_id" FOREIGN KEY("user_id") REFERENCES "users"("id"),
	CONSTRAINT "chat_messages_fk_anons_id" FOREIGN KEY("anons_id") REFERENCES "anons"("id"),
	CONSTRAINT "chat_messages_pk" PRIMARY KEY("message_id")
);
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"login"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"activation_code"	TEXT,
	"is_activated"	INTEGER,
	"is_native"	INTEGER,
	"is_admin"	INTEGER,
	"last_active_time"	INTEGER,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "ChatUsers";
CREATE TABLE IF NOT EXISTS "ChatUsers" (
	"anons_id"	INTEGER,
	"chat_id"	INTEGER,
	"user_id"	INTEGER,
	"last_seen_time"	INTEGER,
	PRIMARY KEY("anons_id","chat_id","user_id")
);

INSERT INTO "users" ("id","login","password","email","activation_code","is_activated","is_native","is_admin","last_active_time") VALUES
 (1,'admin','$2b$10$5.DxSmB19Bh86KyryAZo7.2GT9eDRm3VgFCMye6Wm/p0HzsYAI2ru','admin@trash-mail.com',NULL,1,1,1,NULL),
 (2,'ola','234','ola@example.com','12',1,1,0,20220305),
 (3,'ela','322','ela@mail.com','29',1,1,0,20220306),
 (4,'franek','964','franek@example.com','68',72,1,0,20220301),
 (5,'gocha','954','gocha@torun.pol','65',93,1,0,20220309);

 INSERT INTO "ChatUsers" ("anons_id","chat_id","user_id","last_seen_time") VALUES
 (1,4,3,NULL),
 (1,4,4,NULL),
 (1,5,3,NULL),
 (1,5,5,NULL),
 (2,3,2,NULL),
 (2,3,3,NULL),
 (3,5,3,NULL),
 (3,5,5,NULL);

INSERT INTO "anons" ("id","title","description","category","images","author_id","create_date","lat","lng","type","coat","color","breed","is_active") VALUES
 (1,'Zaginął kot','Kot rasy egipskiej, czarny, nagroda za znalezienie - kot dachowy',3,'',3,20220302,21.0,56.0,'1','','','',0),
 (2,'Pie żre kiełbasę','Kto to widział, żeby wędliny marnować',2,'',2,20220304,56.0,85.0,'2','','','',0),
 (3,'Papuga uciekła','Ara zielona zwiała i nie chce wracać, ktoś widział?',3,'',3,20220307,16.0,43.0,'3',NULL,NULL,NULL,0);

INSERT INTO "ChatMessages" ("message_id","anons_id","chat_id","user_id","message_date","message_text") VALUES
 (1,1,4,4,20220301,'ala ma kota'),
 (2,1,4,3,20220301,'czy to ten moj kot?'),
 (3,1,4,4,20220301,'tego nie wiem ale jest podejrzenie'),
 (4,1,4,4,20220301,'możesz pojechać i sprawdzić'),
 (5,1,4,3,20220302,'dobra, dziś jade sprawdzić'),
 (6,2,3,3,20220305,'nie wiadomo, co to za kiełbasa'),
 (7,2,3,2,20220305,'dobra, śląska'),
 (8,2,3,3,20220306,'psu należy się kiełbasa jak psu kiełbasa'),
 (9,3,5,5,20220308,'odejwij sie, to pogadamy'),
 (10,3,5,5,20220309,'widziałem twoją kozę, pasie się na łące u sąsiada'),
 (11,1,4,4,20220308,'okazało sie, że fela też ma kota');

 COMMIT;
