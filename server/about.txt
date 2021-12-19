server obsługuje nastepujące requesty:

/auth/signup - zakładanie nowego konta
	request.body = {login : string, password : string, email : string}
		login - nazwa użytkownika
		password - hasło
		email - email
	status:
		409 - email zajęty, konto nie zostało utworzone
		201 - konto zostało pomyslnie utworzone
		500 - błąd serwera, spróbuj ponownie później

/auth/activate - aktywowanie nieaktywnego konta
	request.body = {email : string, code : string}
		email - email aktywowanego konta
		code - kod aktywacyjny
	status:
		404 - nie znaleziono konta powiązanego z podanym emailem
		200 - konto zostało aktywowane
		406 - nieprawidlowy kod, nowy kod zostanie wygenerowany i wyslany na maila
		409 - konto jest już aktywne
		
/auth/login - logowanie
	request.body = {email : string, password : string}
		email - email konta
		haslo - haslo konta
	status:
		404 - nie znaleziono konta powiązanego z podanym emailem
		403 - nieprawidłowe hasło
		200 - poprawnie zalogowano i utworzono sesję

/auth/logout - wylogowanie
	request.body = {}
	status:
		200 - wylogowano, sesja została zakończona
		404 - klient nie był zalogowany

/auth/loggedin - test, czy jest się zalogowanym
	request.body = {}
	status:
		200 - zalogowany 
			res.body = {login : string}
				login - nazwa zalogowanego użytkownika
		404 - niezalogowany