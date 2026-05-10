#!/usr/bin/env python
import os
import sys
import json
import random
from datetime import timedelta, date
from django.utils import timezone
from decimal import Decimal

def main():
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    import django
    django.setup()

    try:
        from users.models import CustomUser, Person
        from properties.models import Category, Property, PropertyImage
        from contracts.models import Contract, Paiement, Expense
        from faker import Faker
        
        fake = Faker('fr_FR')

        def create_users_and_persons(count=20):
            print(f"Création de {count} utilisateurs...")
            roles = ['admin', 'agent', 'client']
            for _ in range(count):
                email = fake.unique.email()
                user = CustomUser.objects.create_user(
                    email=email,
                    password='password123',
                    first_name=fake.first_name(),
                    last_name=fake.last_name()
                )
                
                role = random.choice(roles)
                Person.objects.create(
                    user=user,
                    phone=fake.unique.phone_number()[:20],
                    address=fake.address(),
                    identity_card_number=fake.unique.bothify(text='??#######').upper(),
                    balance=Decimal(random.randrange(0, 1000000)) / 100,
                    birth_date=fake.date_of_birth(minimum_age=18, maximum_age=80),
                    role=role,
                    agency_name=fake.company() if role == 'agent' else None,
                    speciality=fake.job() if role == 'agent' else None,
                    profession=fake.job() if role == 'client' else None
                )
            print("Utilisateurs et Personnes créés.")

        def load_categories():
            print("Chargement des catégories...")
            base_dir = os.path.dirname(os.path.abspath(__file__))
            categories_file = os.path.join(base_dir, 'categories.json')
            with open(categories_file, 'r', encoding='utf-8') as f:
                categories_data = json.load(f)
                for cat_data in categories_data:
                    Category.objects.get_or_create(
                        name=cat_data['name'],
                        defaults={'description': cat_data['description']}
                    )
            print("Catégories chargées.")

        def create_properties(count=30):
            print(f"Création de {count} propriétés...")
            categories = list(Category.objects.all())
            agents = list(Person.objects.filter(role='agent'))
            
            if not categories or not agents:
                print("Erreur: Catégories ou agents manquants.")
                return

            statuses = ['vacant', 'loué', 'en travaux', 'reservé', 'available']

            for _ in range(count):
                category = random.choice(categories)
                agent = random.choice(agents)
                contract_type = random.choice(['rent', 'sale'])
                status = random.choice(statuses)
                
                prop = Property.objects.create(
                    title=f"{category.name} {fake.word()} {fake.city()}",
                    description=fake.text(max_nb_chars=500),
                    owner_name=fake.name(),
                    owner_phone=fake.phone_number()[:20],
                    address=fake.street_address(),
                    postal_code=fake.postcode(),
                    city=fake.city(),
                    country="France",
                    latitude=Decimal(fake.latitude()),
                    longitude=Decimal(fake.longitude()),
                    surface=Decimal(random.uniform(20.0, 500.0)).quantize(Decimal('0.00')),
                    bedrooms=random.randint(1, 6),
                    bathrooms=random.randint(1, 3),
                    available_date=fake.date_between(start_date='today', end_date='+1y') if status == 'available' else None,
                    equipements=["Parking", "Cuisine équipée", "Ascenseur", "Balcon"][:random.randint(1, 4)],
                    price=Decimal(random.randrange(500, 1000000)),
                    contract_type=contract_type,
                    status=status,
                    category=category,
                    agent=agent
                )

                # Ajout d'images de test (simulées par des URLs ou chemins vides pour éviter les erreurs d'upload réels)
                for i in range(random.randint(1, 3)):
                    PropertyImage.objects.create(
                        property=prop,
                        image=f"pieces/properties/test_image_{random.randint(1,100)}.jpg"
                    )

            print("Propriétés créées.")

        def create_contracts(count=15):
            print(f"Création de {count} contrats...")
            # On prend des propriétés disponibles pour créer des contrats
            properties = list(Property.objects.filter(status__in=['available', 'vacant']))
            clients = list(Person.objects.filter(role='client'))
            agents = list(Person.objects.filter(role='agent'))

            if not properties or not clients or not agents:
                print("Erreur: Propriétés, clients ou agents manquants.")
                return

            for _ in range(min(count, len(properties))):
                prop = random.choice(properties)
                properties.remove(prop) # Éviter de louer deux fois la même
                client = random.choice(clients)
                agent = random.choice(agents)
                
                start_date = fake.date_between(start_date='-1y', end_date='today')
                end_date = start_date + timedelta(days=365) if prop.contract_type == 'rent' else None
                
                contract = Contract.objects.create(
                    amount=prop.price,
                    start_date=start_date,
                    end_date=end_date,
                    contract_type=prop.contract_type,
                    property=prop,
                    client=client,
                    agent=agent
                )
                
                # Update property status
                prop.status = 'loué' if prop.contract_type == 'rent' else 'unavailable'
                prop.save()

                # Create some payments
                if random.choice([True, False]):
                    Paiement.objects.create(
                        amount=contract.amount / 10 if contract.contract_type == 'rent' else contract.amount,
                        contract=contract,
                    )

                # Create some expenses
                if random.choice([True, False]):
                    Expense.objects.create(
                        amount=Decimal(random.randrange(50, 500)),
                        start_date=start_date,
                        end_date=start_date + timedelta(days=30),
                        description=fake.sentence(),
                        contract=contract
                    )
            print("Contrats, paiements et dépenses créés.")

        # Nettoyage optionnel des anciennes données pour repartir à zéro
        # Person.objects.all().delete()
        # CustomUser.objects.exclude(is_superuser=True).delete()
        # Category.objects.all().delete()
        # Property.objects.all().delete()
        # Contract.objects.all().delete()

        # Execution
        create_users_and_persons(10)
        load_categories()
        create_properties(20)
        create_contracts(10)

        print("Toutes les données de test ont été insérées avec succès.")

    except ImportError as e:
        print(f"Erreur d'importation : {e}. Assurez-vous que faker est installé.")
    except Exception as e:
        print(f"Une erreur est survenue : {e}")

if __name__ == '__main__':
    main()
