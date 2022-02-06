serwer mozna uruchomic komenda node main.js lub npm start
server obsługuje nastepujące requesty:


post /auth/signup - zakładanie nowego konta
	request.body = {login : string, password : string, email : string}
		login - nazwa użytkownika
		password - hasło
		email - email
	- w przypadku pomyslnego utworzenia konta zostanie zwrocony kod 201, a na podany email zostanie wyslany link aktywacyjny
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- email zajety
		- haslo za slabe - haslo musi miec miedzy 8 a 50 znakow, zawierac co najmniej 1 mala i wielka litere, 2 cyfry i nie zawierac spacji


post /auth/activate - aktywowanie nieaktywnego konta
	request.body = {code : string}
		code - kod aktywacyjny
	- w przypadku pomyslnej aktywacji zwrocony zostanie kod 200
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- podany kod nie jest przypisany do zadnego niekatywnego konta
	
	
post /auth/login - logowanie przy pomocy konta natywnego
	request.body = {email : string, password : string}
		email - email konta
		haslo - haslo konta
	- w przypadku pomyslnego zalogowania tworzona jest sesja i zwracany jest kod 200 i obiekt json zawierajacy pola: 
		- login
		- email
		- user_id
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- podany email nie wystepuje w bazie danych (konto nie istnieje)
		- konto nie zostalo aktywowane
		- niepoprawne haslo
		- konto wymaga autentyfikacji przy pomocy zewnetrznego providera
		

get /auth/google/url - link do logowania przy pomocy konta google
	- jesli podany zostal parametr type=web, serwer, po zakonczeniu uwierzytelniania endpoint /auth/google przekieruje na adres aplikacji webowej
	- zwraca kod 200 i obiekt json z atrybutem url ktory przekierowuje do strony logowania przy pomocy google - po zalogowaniu nastepuje automatyczne przekierowanie do /auth/google
	

get /auth/google
	- w przypadku pomyslnego zalogowania tworzona jest sesja, zwracany jest kod 200 i obiekt json zawierajacy pola: 
		- login
		- email
		- user_id
	- jesli email uzytkownika nie widnial w bazie danych, tworzone jest nowe konto
	- jesli link do autentyfikacji zostal uzyskany z podaniem parametru type=web, po zalogowaniu nastapi przekierowanie na adres aplikacji webowej


get /auth/facebook/url - link do logowania przy pomocy konta facebook
	- jesli podany zostal parametr type=web, serwer, po zakonczeniu uwierzytelniania endpoint /auth/google przekieruje na adres aplikacji webowej
	- zwraca kod 200 i obiekt json z atrybutem url ktory przekierowuje do strony logowania przy pomocy facebooka - po zalogowaniu nastepuje automatyczne przekierowanie do /auth/facebook

get /auth/facebook
	- w przypadku pomyslnego zalogowania tworzona jest sesja, zwracany jest kod 200 i obiekt json zawierajacy pola: 
		- login
		- email
		- user_id
	- jesli email uzytkownika nie widnial w bazie danych, tworzone jest nowe konto
	- jesli link do autentyfikacji zostal uzyskany z podaniem parametru type=web, po zalogowaniu nastapi przekierowanie na adres aplikacji webowej


get /auth/logout - wylogowanie
	- jesli klient byl zalogowany, sesja jest niszczona i zwracany jest kod 200
	- w przeciwnym wypadku zwracany jest kod 403


get /auth/loggedin - test, czy jest się zalogowanym
	- jesli klient jest zalogowany, zwracany jest kod 200 i obiekt json zawierajacy pola: 
		- login
		- email
		- user_id
	- jesli klient nie jest zalogowany, zwracany jest kod 403






post /anons/add - dodaje ogloszenie - klient musi byc zalogowany
	request.body = {title : string, description : string, category : int, pictures : file[], lat : float, lng : float}
		title - tytul ogloszenia
		description - opis ogloszenia
		category - 0 - ogłoszenie zaginiecia, category = 1 - ogloszenie znalezienia
		pictures - zdjecia zwiazane z ogloszeniem. Max 8 zdjec na request
		lat - szerokosc geograficzna w stopniach
		lng - dlugosc geograficzna w stopniach
	- jesli klient nie jest zalogowany, zwraca kod 401
	- jesli ktores z obowiazkowych pol(kazde, oprocz pictures) jest puste, lub zawiera nieprawidlowe dane, zwraca kod 400
	- w razie sukcesu ogloszenie zostaje dodane do bazy i zwracany jest kod 200 razem z obiektem json zawierajacy pole id, oznaczajace id ogloszenia
	- formularz z plikami latwo przeslac przy pomocy FormData	

get /anons - zwraca informacje o ogloszeniu o numerze id rownym parametrowi id
	- jesli ogloszenie od podanym id nie istnieje, zwracany jest kod 404
	- jesli ogloszenie istnieje, zwracany jest kod 200 i obiekt json zawieracy pola:
		id - id ogloszenia
		title - tytul ogloszenia
		description - opis ogloszenia
		category - 0 - ogłoszenie zaginiecia, category = 1 - ogloszenie znalezienia
		images - tablica zawierajaca nazwy zdjec powiazanych z ogloszeniem
		author_id - id uzytkownika, ktory umiescil ogloszenie
		create_date - data zamieszczenia ogloszenia
		lat - szerokosc geograficzna w stopniach
		lng - dlugosc geograficzna w stopniach


get /anons/photo - zwraca zdjecie o nazwie rownej parametrowi name
	- wysyla zdjecie o podanej nazwie, jesli ono istnieje
	- jesli zdjecie nie istnieje, zwraca kod 404
