# Projekt indywidualny

## Wymagania

Aby uruchomić projekt, należy zainstalować `Docker` i `Docker Compose`.

## Uruchamianie

```shell
docker-compose up
```

Po uruchomieniu projektu można zobaczyć stronę na [localhost:80](http://localhost:80). Wirtualne drukarki 3D są dostępne
pod adresami [localhost:8081](http://localhost:8081/#control) oraz [localhost:8082](http://localhost:8082/#control).
Aby zalogować się do drukarek, należy wpisać login i hasło, które podane są w pliku [data/README.md](data/README.md).
Specyfikacja API oraz wirtualny playground dostępny jest pod adresem [localhost:80/api-docs/](http://localhost:80/api-docs/).

## Uruchamianie testów

Testy jednostkowe dla serwera są uruchamiane za pomocą komendy:

```bash
cd production/server
npm run test
```

Testy jednostkowe dla aplikacji webowej są uruchamiane za pomocą komendy:

```bash
cd production/web
npm run test
```

## Testowanie api

W katalogu tests znajdują się kolekcje zapytań i ich testów. Można uruchomić testy za pomocą programu `Postman`.
