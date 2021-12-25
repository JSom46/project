server obsługuje nastepujące requesty:

post /auth/signup - zakładanie nowego konta
	request.body = {login : string, password : string, email : string}
		login - nazwa użytkownika
		password - hasło
		email - email
	- w przypadku pomyslnego utworzenia konta zostanie zwrocony kod 201, a na podany email zostanie wyslany kod aktywacyjny
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- email zajety
		- haslo za slabe - haslo musi miec miedzy 8 a 50 znakow, zawierac co najmniej 1 mala i wielka litere, 2 cyfry i nie zawierac spacji

patch /auth/activate - aktywowanie nieaktywnego konta
	request.body = {email : string, code : string}
		email - email aktywowanego konta
		code - kod aktywacyjny
	- w przypadku pomyslnej aktywacji zwrocony zostanie kod 200
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- podany email nie wystepuje w bazie danych (konto nie istnieje)
		- konto juz jest aktywne
		- niepoprawny kod aktywacyjny - dodatkowo zostanie wygenerowany i wyslany nowy kod - stary bedzie juz nieaktualny
		
get /auth/login - logowanie przy pomocy konta natywnego
	request.body = {email : string, password : string}
		email - email konta
		haslo - haslo konta
	- w przypadku pomyslnego zalogowania tworzona jest sesja i zwracany jest kod 200 i obiekt json z atrybutem login zawierajacym nazwe uzytkownika
	- w jednym z ponizszych przypadkow zostanie zwrocony kod 400 i obiekt json z atrybutem msg zawierajacym informacje o bledzie:
		- podany email nie wystepuje w bazie danych (konto nie istnieje)
		- konto nie zostalo aktywowane
		- niepoprawne haslo
		- konto wymaga autentykacji przy pomocy zewnetrznego providera
		
get /auth/google/url - logowanie przy pomocy konta google
	request.body = {}
	- zwraca kod 200 i obiekt json z atrybutem url ktory zawiera przekierowanie do strony 
		logowania przy pomocy google - po zalogowaniu nastepuje automatyczne przekierowanie do /auth/google
	
get /auth/google
	- w przypadku pomyslnego zalogowania tworzona jest sesja i zwracany jest kod 200 i obiekt json z atrybutem login 
		zawierajacym nazwe uzytkownika, jesli email uzutkownika nie widnial w bazie danych, tworzone jest nowe konto

get /auth/logout - wylogowanie
	request.body = {}
		200 - wylogowano, sesja została zakończona
		403 - klient nie był zalogowany

get /auth/loggedin - test, czy jest się zalogowanym
	request.body = {}
	- jesli klient jest zalogowany, zwracany jest status 200 i obiekt json z atrybutem login zawierajacym nazwe uzytkonika
	- jesli klient nie jest zalogowany, zwracany jest kod 403