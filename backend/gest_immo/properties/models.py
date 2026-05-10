from django.db import models
from users.models import Person

class Category(models.Model):
    """
    Catégorie de bien (Appartement, Maison, Bureau, etc.)
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255)
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Property(models.Model):
    """
    Bien immobilier
    """
    STATUS_CHOICES = [
        ('vacant', 'Vacant'),
        ('loué', 'Loué'),
        ('en travaux', 'En travaux'),
        ('reservé', 'Réservé'),
        ('available', 'Disponible'),
        ('unavailable', 'Indisponible'),
    ]
    CONTRACT_TYPE_CHOICES = [
        ('rent', 'Location'),
        ('sale', 'Vente'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Infos du propriétaire 
    owner_name = models.CharField(max_length=200)
    owner_phone = models.CharField(max_length=20, blank=True)
    
    # Localisation
    address = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=15)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Détails techniques
    available_date = models.DateField(null=True, blank=True, verbose_name="Date de disponibilité")
    surface = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Surface (m²)",
        help_text="Surface en mètres carrés"
    )
    
    bedrooms = models.IntegerField(
        verbose_name="Nombre de chambres",
        default=1
    )
    
    bathrooms = models.IntegerField(
        verbose_name="Nombre de salles de bain",
        default=1
    )

    equipments = models.JSONField(
        default=list,
        blank=True,
        null=True,
        verbose_name="Équipements",
        help_text="Liste des équipements"
    )
    
    # Prix et statut
    price = models.DecimalField(max_digits=10, decimal_places=2)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monthly_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Relations
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT,
        related_name='properties'
    )
    owner_profile = models.ForeignKey(
        'users.Person',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_properties'
    )
    agent = models.ForeignKey(
        'users.Person',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'agent'},
        related_name='properties'
    )
    
    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
    
    def __str__(self):
        return f"{self.title} - {self.address}"

class PropertyImage(models.Model):
    """
    Images d'un bien
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='pieces/properties/')
    
    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
    
    def __str__(self):
        return f"Image for {self.property.title}"

