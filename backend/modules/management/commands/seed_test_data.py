import logging
from django.core.management.base import BaseCommand
from django.db import transaction
# Corrected import path assuming models.py is in the parent 'modules' directory
from ...models import Module, Content, Task, SupplementaryContent
from django.contrib.auth.models import User # Import User model

# Configure logger
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Cleans and seeds the database with test data for Python modules.' # Updated help text

    def _create_module(self, title, is_public=True):
        module, created = Module.objects.get_or_create(
            title=title,
            defaults={'is_public': is_public}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Module: "{title}"'))
        else:
            self.stdout.write(f'Module "{title}" already exists.')
        return module

    def _create_content(self, module, title, description, order, video_url=None, supplementary_title=None):
        content, created = Content.objects.get_or_create(
            module=module,
            title=title,
            defaults={
                'description': description,
                'order': order,
                'video_url': video_url,
                'supplementary_title': supplementary_title
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'  - Created Content: "{title}"'))
        else:
            self.stdout.write(f'  - Content "{title}" already exists.')
        return content

    def _create_task(self, module, title, description, difficulty, test_path, order, hint=None):
        task, created = Task.objects.get_or_create(
            module=module,
            title=title,
            defaults={
                'description': description,
                'difficulty': difficulty,
                'test_file_path': test_path,
                'order': order,
                'hint': hint
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'  - Created Task: "{title}" (Tests: {test_path})'))
        else:
            self.stdout.write(f'  - Task "{title}" already exists.')
        return task

    def _create_supplementary(self, content, label, url, order):
        sup_content, created = SupplementaryContent.objects.get_or_create(
            content=content,
            label=label,
            url=url,
            defaults={'order': order}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'    - Added Supplementary: "{label}"'))
        else:
            self.stdout.write(f'    - Supplementary "{label}" already exists.')
        return sup_content

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting database cleanup before seeding...'))

        # --- Cleanup existing data --- 
        deleted_count, _ = SupplementaryContent.objects.all().delete()
        self.stdout.write(f'  - Deleted {deleted_count} SupplementaryContent objects.')
        deleted_count, _ = Content.objects.all().delete()
        self.stdout.write(f'  - Deleted {deleted_count} Content objects.')
        deleted_count, _ = Task.objects.all().delete()
        self.stdout.write(f'  - Deleted {deleted_count} Task objects.')
        # Keep ModuleAccess and UserTaskProgress data, only delete Modules
        # If Modules are deleted, related access/progress might be cascaded depending on model definition
        deleted_count, _ = Module.objects.all().delete()
        self.stdout.write(f'  - Deleted {deleted_count} Module objects.')
        self.stdout.write(self.style.SUCCESS('Cleanup finished.'))

        # --- Create Test User (remains unchanged) ---
        self.stdout.write('Creating test user...')
        test_username = "test"
        test_password = "test"
        test_email = "test@test.com"
        user, created = User.objects.get_or_create(
            username=test_username,
            defaults={'email': test_email, 'is_staff': True, 'is_superuser': True}
        )
        if created:
            user.set_password(test_password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created test user "{test_username}"'))
        else:
            user.email = test_email
            user.set_password(test_password)
            user.save()
            self.stdout.write(f'Test user "{test_username}" already exists. Password has been reset.')

        # --- Start Seeding --- 
        self.stdout.write(self.style.SUCCESS('Starting database seeding for Python modules...'))

        # ===========================
        # === Python Grundlagen ===
        # ===========================
        module_basics = self._create_module("Python Grundlagen")

        # --- Content & Tasks for Grundlagen ---
        c_basics_1 = self._create_content(module_basics, "Einführung: Dein erstes Programm", 'Lerne die Grundlagen von Python und schreibe "Hallo Welt!".', 1, 'https://www.youtube.com/watch?v=example_intro')
        self._create_task(module_basics, "Aufgabe: Hallo Welt Ausgabe", 'Schreibe eine Funktion `say_hello()`, die "Hallo Welt!" zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_basics/test_hello_world.py", 1, 'Achte auf das Ausrufezeichen.')

        c_basics_2 = self._create_content(module_basics, "Variablen und Datentypen", 'Zahlen (int, float), Strings (str), Booleans (bool).', 2, 'https://www.youtube.com/watch?v=example_vars')
        self._create_task(module_basics, "Aufgabe: Einfache Addition", 'Schreibe `add_two_numbers(a, b)`, die `a + b` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_basics/test_addition.py", 2, 'Benutze den `+` Operator.')
        self._create_task(module_basics, "Aufgabe: String Verkettung", 'Schreibe `greet_user(name)`, die `"Hallo, " + name + "!"` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_basics/test_string_concat.py", 3)

        c_basics_3 = self._create_content(module_basics, "Kontrollstrukturen: If/Else", 'Bedingte Anweisungen mit `if`, `elif` und `else`.', 3, 'https://www.youtube.com/watch?v=example_if_else')
        self._create_task(module_basics, "Aufgabe: Gerade oder Ungerade", 'Schreibe `is_even(number)`, die `True` zurückgibt, wenn `number` gerade ist, sonst `False`.', Task.Difficulty.EASY, "task_tests/module_python_basics/test_even_odd.py", 4, 'Der Modulo-Operator `%` ist nützlich.')

        c_basics_4 = self._create_content(module_basics, "Kontrollstrukturen: Schleifen", 'Wiederholungen mit `for`- und `while`-Schleifen.', 4, 'https://www.youtube.com/watch?v=example_loops')
        self._create_task(module_basics, "Aufgabe: Summe einer Liste", 'Schreibe `sum_list(numbers)`, die die Summe aller Zahlen in der Liste `numbers` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_basics/test_sum_list.py", 5)
        self._create_task(module_basics, "Aufgabe: Countdown", 'Schreibe `countdown(start)`, die die Zahlen von `start` bis 1 ausgibt (jede in einer neuen Zeile) und dann "Start!". Verwende `print`.', Task.Difficulty.MEDIUM, "task_tests/module_python_basics/test_countdown.py", 6, 'Eine `while`-Schleife könnte hier passen.')

        c_basics_5 = self._create_content(module_basics, "Einfache Funktionen", 'Funktionen definieren und aufrufen.', 5, 'https://www.youtube.com/watch?v=example_functions')
        self._create_task(module_basics, "Aufgabe: Max von Drei", 'Schreibe `max_of_three(a, b, c)`, die die größte der drei Zahlen zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_basics/test_max_three.py", 7, 'Verwende `if/elif/else`.')


        # ===================================
        # === Python Datenstrukturen ===
        # ===================================
        module_datastruct = self._create_module("Python Datenstrukturen")

        # --- Content & Tasks for Datenstrukturen ---
        c_ds_1 = self._create_content(module_datastruct, "Listen: Grundlagen & Methoden", 'Erstellen, Indizieren, Slicing, Methoden wie `append`, `insert`, `remove`.', 1, 'https://www.youtube.com/watch?v=example_ds_lists')
        self._create_task(module_datastruct, "Aufgabe: Liste manipulieren", 'Schreibe `manipulate_list(input_list)`, die das erste Element entfernt, die Zahl 100 am Ende hinzufügt und die Liste zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_datastruct/test_manipulate_list.py", 1)

        c_ds_2 = self._create_content(module_datastruct, "Tupel: Unveränderliche Sequenzen", 'Erstellung, Verwendung und Unterschiede zu Listen.', 2, 'https://www.youtube.com/watch?v=example_ds_tuples')
        self._create_task(module_datastruct, "Aufgabe: Tupel Entpacken", 'Schreibe `get_coordinates()`, die das Tupel `(10, 25)` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_datastruct/test_get_coordinates.py", 2, 'Tupel werden mit runden Klammern `()` erstellt.')

        c_ds_3 = self._create_content(module_datastruct, "Dictionaries: Key-Value Speicher", 'Erstellen, Zugriff, Methoden wie `keys`, `values`, `items`.', 3, 'https://www.youtube.com/watch?v=example_ds_dicts')
        self._create_supplementary(c_ds_3, "Python Doku: Dictionaries", "https://docs.python.org/3/tutorial/datastructures.html#dictionaries", 1)
        self._create_task(module_datastruct, "Aufgabe: Dictionary Zugriff", 'Schreibe `get_capital(country_dict, country)`, die die Hauptstadt aus dem Dict `country_dict` für das Land `country` zurückgibt. Gib `"Unbekannt"` zurück, falls das Land nicht existiert.', Task.Difficulty.MEDIUM, "task_tests/module_python_datastruct/test_get_capital.py", 3, 'Verwende `get()` mit einem Default-Wert.')

        c_ds_4 = self._create_content(module_datastruct, "Sets: Einzigartige Elemente", 'Erstellung, Mengenoperationen (Vereinigung, Schnittmenge, Differenz).', 4, 'https://www.youtube.com/watch?v=example_ds_sets')
        self._create_task(module_datastruct, "Aufgabe: Eindeutige Elemente finden", 'Schreibe `find_unique(elements)`, die ein Set mit den eindeutigen Elementen aus der Liste `elements` zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_datastruct/test_find_unique.py", 4)
        self._create_task(module_datastruct, "Aufgabe: Gemeinsame Elemente", 'Schreibe `find_common(list1, list2)`, die ein Set der gemeinsamen Elemente beider Listen zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_datastruct/test_find_common.py", 5, 'Nutze die Schnittmengen-Operation (`&`).')


        # ===================================
        # === Python Fortgeschrittene ===
        # ===================================
        module_advanced = self._create_module("Python Fortgeschrittene")

        # --- Content & Tasks for Fortgeschrittene ---
        c_adv_1 = self._create_content(module_advanced, "List Comprehensions", 'Effiziente Listenerstellung.', 1, 'https://www.youtube.com/watch?v=example_adv_listcomp')
        self._create_supplementary(c_adv_1, "RealPython: List Comprehensions", "https://realpython.com/list-comprehension-python/", 1)
        self._create_task(module_advanced, "Aufgabe: Quadratzahlen", 'Erstelle `get_squared_numbers(numbers)` mit List Comprehension.', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_list_comp.py", 1)
        self._create_task(module_advanced, "Aufgabe: Gerade Zahlen filtern", 'Schreibe `filter_even(numbers)` mit List Comprehension, die nur gerade Zahlen zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_filter_even_comp.py", 2, 'Füge eine `if`-Bedingung hinzu.')

        c_adv_2 = self._create_content(module_advanced, "Funktionen: *args und **kwargs", 'Variable Anzahl von Argumenten.', 2, 'https://www.youtube.com/watch?v=example_adv_args_kwargs')
        self._create_task(module_advanced, "Aufgabe: Summe mit *args", 'Schreibe `sum_all(*args)`, die die Summe aller übergebenen Argumente zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_sum_args.py", 3)

        c_adv_3 = self._create_content(module_advanced, "Lambda-Ausdrücke", 'Anonyme Funktionen für kurze Operationen.', 3, 'https://www.youtube.com/watch?v=example_adv_lambda')
        self._create_task(module_advanced, "Aufgabe: Lambda für Sortierung", 'Schreibe `sort_by_age(data)`, die eine Liste von Tupeln `(name, alter)` nach Alter sortiert.', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_lambda_sort.py", 4)
        self._create_task(module_advanced, "Aufgabe: Einfacher Lambda-Filter", 'Schreibe `filter_positive(numbers)`, die mit `filter()` und Lambda nur positive Zahlen zurückgibt (als Liste).', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_lambda_filter.py", 5)

        c_adv_4 = self._create_content(module_advanced, "Map und Filter", 'Funktionale Programmierungskonzepte.', 4, 'https://www.youtube.com/watch?v=example_adv_map_filter')
        self._create_task(module_advanced, "Aufgabe: Strings in Großbuchstaben", 'Schreibe `uppercase_strings(strings)`, die `map()` verwendet, um alle Strings in einer Liste in Großbuchstaben umzuwandeln.', Task.Difficulty.MEDIUM, "task_tests/module_python_advanced/test_map_upper.py", 6)


        # ========================================================
        # === Objektorientierte Programmierung (OOP) in Python ===
        # ========================================================
        module_oop = self._create_module("OOP in Python")

        # --- Content & Tasks for OOP ---
        c_oop_1 = self._create_content(module_oop, "Einführung in Klassen und Objekte", 'Konzepte von OOP, Klassen definieren, Instanzen erstellen.', 1, 'https://www.youtube.com/watch?v=example_oop_intro')
        self._create_task(module_oop, "Aufgabe: Einfache Klasse 'Hund'", 'Definiere eine Klasse `Dog` mit einer `__init__` Methode, die `name` und `breed` setzt, und einer Methode `bark()` die `"Woof!"` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_oop/test_dog_class.py", 1)

        c_oop_2 = self._create_content(module_oop, "Attribute und Methoden", 'Instanzattribute, Klassenattribute, Instanzmethoden, Klassenmethoden, Statische Methoden.', 2, 'https://www.youtube.com/watch?v=example_oop_attrs')
        self._create_task(module_oop, "Aufgabe: Auto-Klasse mit Methode", 'Definiere `Car` mit `__init__(make, model)` und einer Methode `display_info()` die `"Make: [make], Model: [model]"` zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_oop/test_car_class.py", 2)

        c_oop_3 = self._create_content(module_oop, "Vererbung", 'Klassen erweitern, Methoden überschreiben, `super()`.', 3, 'https://www.youtube.com/watch?v=example_oop_inherit')
        self._create_task(module_oop, "Aufgabe: Vererbung 'Elektroauto'", 'Erstelle `ElectricCar`, die von `Car` erbt. Füge ein Attribut `battery_size` hinzu und überschreibe `display_info()`, um die Batteriegröße anzuzeigen.', Task.Difficulty.MEDIUM, "task_tests/module_python_oop/test_electric_car.py", 3)

        c_oop_4 = self._create_content(module_oop, "Polymorphie und Duck Typing", 'Flexibles Design durch Polymorphie.', 4, 'https://www.youtube.com/watch?v=example_oop_poly')
        # Keine direkte Aufgabe, eher ein Konzept

        c_oop_5 = self._create_content(module_oop, "Spezielle Methoden (Magic Methods)", 'Methoden wie `__str__`, `__repr__`, `__len__`.', 5, 'https://www.youtube.com/watch?v=example_oop_magic')
        self._create_task(module_oop, "Aufgabe: __str__ für Buch", 'Definiere `Book` mit `__init__(title, author)` und implementiere `__str__`, die `"[title] by [author]"` zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_oop/test_book_str.py", 4)


        # ======================================
        # === Dateiverarbeitung in Python ===
        # ======================================
        module_files = self._create_module("Dateiverarbeitung in Python")

        # --- Content & Tasks for Files ---
        c_files_1 = self._create_content(module_files, "Dateien lesen und schreiben", 'Öffnen, Lesen (`read`, `readline`, `readlines`), Schreiben (`write`), `with` Statement.', 1, 'https://www.youtube.com/watch?v=example_files_readwrite')
        self._create_task(module_files, "Aufgabe: Dateiinhalt lesen", 'Schreibe `read_file_content(filepath)`, die den gesamten Inhalt einer Textdatei liest und zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_files/test_read_file.py", 1, 'Verwende `with open(...)`.')

        self._create_task(module_files, "Aufgabe: In Datei schreiben", 'Schreibe `write_to_file(filepath, text)`, die den `text` in die angegebene Datei schreibt (überschreibt bestehenden Inhalt).', Task.Difficulty.EASY, "task_tests/module_python_files/test_write_file.py", 2)

        c_files_2 = self._create_content(module_files, "Arbeiten mit CSV-Dateien", 'Das `csv`-Modul zum Lesen und Schreiben von CSV-Daten.', 2, 'https://www.youtube.com/watch?v=example_files_csv')
        self._create_task(module_files, "Aufgabe: CSV lesen", 'Schreibe `read_csv_data(filepath)`, die eine CSV-Datei liest und die Daten als Liste von Dictionaries zurückgibt (Kopfzeile als Keys).', Task.Difficulty.MEDIUM, "task_tests/module_python_files/test_read_csv.py", 3, 'Nutze `csv.DictReader`.')

        c_files_3 = self._create_content(module_files, "Arbeiten mit JSON-Dateien", 'Das `json`-Modul zum Parsen und Erstellen von JSON.', 3, 'https://www.youtube.com/watch?v=example_files_json')
        self._create_task(module_files, "Aufgabe: JSON laden", 'Schreibe `load_json_data(filepath)`, die JSON-Daten aus einer Datei lädt und als Python-Objekt zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_files/test_load_json.py", 4, 'Nutze `json.load`.')
        self._create_task(module_files, "Aufgabe: JSON speichern", 'Schreibe `save_json_data(filepath, data)`, die ein Python-Objekt `data` als JSON in eine Datei speichert.', Task.Difficulty.MEDIUM, "task_tests/module_python_files/test_save_json.py", 5, 'Nutze `json.dump`.')


        # ====================================
        # === Fehlerbehandlung in Python ===
        # ====================================
        module_errors = self._create_module("Fehlerbehandlung in Python")

        # --- Content & Tasks for Errors ---
        c_errors_1 = self._create_content(module_errors, "try, except, else, finally", 'Grundlagen der Fehlerbehandlung.', 1, 'https://www.youtube.com/watch?v=example_errors_try_except')
        self._create_task(module_errors, "Aufgabe: Sichere Division", 'Schreibe `safe_divide(a, b)`, die `a / b` zurückgibt. Fange `ZeroDivisionError` ab und gib in diesem Fall `None` zurück.', Task.Difficulty.EASY, "task_tests/module_python_errors/test_safe_divide.py", 1)

        c_errors_2 = self._create_content(module_errors, "Spezifische Exceptions abfangen", 'Umgang mit verschiedenen Fehlertypen (`TypeError`, `ValueError`, etc.).', 2, 'https://www.youtube.com/watch?v=example_errors_specific')
        self._create_task(module_errors, "Aufgabe: Zahl konvertieren", 'Schreibe `convert_to_int(value)`, die `value` in einen Integer konvertiert. Fange `ValueError` und `TypeError` ab und gib `None` zurück, falls die Konvertierung fehlschlägt.', Task.Difficulty.MEDIUM, "task_tests/module_python_errors/test_convert_int.py", 2)

        c_errors_3 = self._create_content(module_errors, "Eigene Exceptions erstellen", 'Benutzerdefinierte Fehlerklassen für spezifische Anwendungsfälle.', 3, 'https://www.youtube.com/watch?v=example_errors_custom')
        self._create_task(module_errors, "Aufgabe: Eigene Exception werfen", 'Definiere eine Exception `InvalidAgeError`. Schreibe `validate_age(age)`, die `InvalidAgeError` wirft, wenn `age` negativ ist.', Task.Difficulty.MEDIUM, "task_tests/module_python_errors/test_custom_exception.py", 3, 'Eigene Exceptions erben typischerweise von `Exception`.')


        # ==================================
        # === Python Standardbibliothek ===
        # ==================================
        module_stdlib = self._create_module("Python Standardbibliothek")

        # --- Content & Tasks for StdLib ---
        c_stdlib_1 = self._create_content(module_stdlib, "Das `os`-Modul", 'Interaktion mit dem Betriebssystem: Dateisystem, Umgebungsvariablen.', 1, 'https://www.youtube.com/watch?v=example_stdlib_os')
        self._create_task(module_stdlib, "Aufgabe: Aktuelles Verzeichnis", 'Schreibe `get_current_dir()`, die das aktuelle Arbeitsverzeichnis zurückgibt.', Task.Difficulty.EASY, "task_tests/module_python_stdlib/test_get_cwd.py", 1, 'Importiere `os` und verwende `os.getcwd()`.')

        c_stdlib_2 = self._create_content(module_stdlib, "Das `datetime`-Modul", 'Arbeiten mit Datum und Uhrzeit.', 2, 'https://www.youtube.com/watch?v=example_stdlib_datetime')
        self._create_task(module_stdlib, "Aufgabe: Heutiges Datum", 'Schreibe `get_today_date_str()`, die das heutige Datum als String im Format "YYYY-MM-DD" zurückgibt.', Task.Difficulty.MEDIUM, "task_tests/module_python_stdlib/test_today_date.py", 2, 'Importiere `date` aus `datetime` und verwende `date.today().isoformat()`.')

        c_stdlib_3 = self._create_content(module_stdlib, "Das `json`-Modul (Vertiefung)", 'Umgang mit komplexeren JSON-Strukturen.', 3, 'https://www.youtube.com/watch?v=example_stdlib_json2')
        # Aufgabe hierfür wäre redundant zu Dateiverarbeitung

        c_stdlib_4 = self._create_content(module_stdlib, "Das `requests`-Modul (Extern)", 'HTTP-Anfragen senden (Installation nötig: `pip install requests`).', 4, 'https://www.youtube.com/watch?v=example_stdlib_requests')
        self._create_supplementary(c_stdlib_4, "Requests Doku", "https://requests.readthedocs.io/en/latest/", 1)
        self._create_task(module_stdlib, "Aufgabe: Einfache GET-Anfrage", 'Schreibe `fetch_url_status(url)`, die eine GET-Anfrage an die `url` sendet und den Statuscode der Antwort zurückgibt. (Hinweis: `requests`-Bibliothek wird benötigt).', Task.Difficulty.MEDIUM, "task_tests/module_python_stdlib/test_requests_get.py", 3, 'Importiere `requests` und verwende `requests.get(url).status_code`.')


        # ===========================
        # === Python Profis ===
        # ===========================
        module_pro = self._create_module("Python Profis")

        # --- Content & Tasks for Profis ---
        c_pro_1 = self._create_content(module_pro, "Decorators: Grundlagen", 'Funktionen modifizieren und erweitern.', 1, 'https://www.youtube.com/watch?v=example_pro_decorators')
        self._create_task(module_pro, "Aufgabe: Einfacher Logging Decorator", 'Schreibe `@log_calls`, der vor Aufruf Name/Args loggt und nachher das Ergebnis.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_logging_decorator.py", 1)
        self._create_task(module_pro, "Aufgabe: Timing Decorator", 'Schreibe `@time_it`, der die Ausführungszeit einer Funktion misst und ausgibt.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_timing_decorator.py", 2, 'Verwende das `time`-Modul.')

        c_pro_2 = self._create_content(module_pro, "Generators und Iterators", 'Speichereffiziente Datenverarbeitung.', 2, 'https://www.youtube.com/watch?v=example_pro_generators')
        self._create_task(module_pro, "Aufgabe: Fibonacci Generator", 'Implementiere `fibonacci_generator(limit=None)`.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_fibonacci_generator.py", 3)
        self._create_task(module_pro, "Aufgabe: Eigener Iterator (Countdown)", 'Erstelle eine Klasse `CountdownIterator`, die von einer Zahl herunterzählt.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_countdown_iterator.py", 4, 'Implementiere `__iter__` und `__next__`.')

        c_pro_3 = self._create_content(module_pro, "Context Managers (`with`)", 'Ressourcenmanagement mit `__enter__` und `__exit__`.', 3, 'https://www.youtube.com/watch?v=example_pro_context')
        self._create_task(module_pro, "Aufgabe: Einfacher Context Manager", 'Erstelle eine Klasse `TimerContext`, die beim Betreten die Zeit misst und beim Verlassen die vergangene Zeit ausgibt.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_timer_context.py", 5)

        c_pro_4 = self._create_content(module_pro, "Metaklassen (Einführung)", 'Klassen zur Laufzeit erstellen und modifizieren (fortgeschritten).', 4, 'https://www.youtube.com/watch?v=example_pro_metaclass')
        # Keine Aufgabe, da sehr fortgeschritten

        c_pro_5 = self._create_content(module_pro, "Asynchrone Programmierung (async/await)", 'Grundlagen von `asyncio` für nebenläufige Operationen.', 5, 'https://www.youtube.com/watch?v=example_pro_async')
        self._create_supplementary(c_pro_5, "RealPython: Async IO", "https://realpython.com/async-io-python/", 1)
        self._create_task(module_pro, "Aufgabe: Einfache asynchrone Funktion", 'Schreibe eine `async def fetch_data(url)` die (simuliert) Daten abruft, indem sie 1 Sekunde wartet (`asyncio.sleep(1)`) und einen Dummy-String zurückgibt.', Task.Difficulty.HARD, "task_tests/module_python_pro/test_async_fetch.py", 6, 'Importiere `asyncio`.')


        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully for all Python modules.')) 