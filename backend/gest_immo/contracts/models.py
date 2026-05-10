from django.db import models
from users.models import Person
from properties.models import Property

class Application(models.Model):
    """
    Candidature pour un bien immobilier
    """
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Refusée'),
        ('cancelled', 'Annulée'),
    ]
    DOSSIER_STATUS_CHOICES = [
        ('incomplete', 'Incomplet'),
        ('complete', 'Complet'),
        ('verified', 'Vérifié'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='applications')
    tenant = models.ForeignKey(
        Person, 
        on_delete=models.CASCADE, 
        related_name='applications',
        limit_choices_to={'role': 'client'}
    )
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    dossier_status = models.CharField(max_length=20, choices=DOSSIER_STATUS_CHOICES, default='incomplete')
    rejection_reason = models.TextField(blank=True, null=True)
    visit_date = models.DateTimeField(null=True, blank=True)
    conversation = models.OneToOneField(
        'features.Conversation', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='application'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"

    def __str__(self):
        return f"Candidature de {self.tenant} pour {self.property}"

class Visit(models.Model):
    """
    Visite programmée pour un bien
    """
    STATUS_CHOICES = [
        ('scheduled', 'Planifiée'),
        ('completed', 'Effectuée'),
        ('cancelled', 'Annulée'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='visits')
    tenant = models.ForeignKey(
        Person, 
        on_delete=models.CASCADE, 
        related_name='visits',
        limit_choices_to={'role': 'client'}
    )
    agent = models.ForeignKey(
        Person,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='agent_visits',
        limit_choices_to={'role': 'agent'}
    )
    scheduled_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Visite"
        verbose_name_plural = "Visites"

    def __str__(self):
        return f"Visite de {self.property} par {self.tenant} le {self.scheduled_date}"

class Contract(models.Model):
    """
    Contrat de location/vente
    """
    CONTRACT_TYPE_CHOICES = [
        ('rent', 'Location'),
        ('sale', 'Vente'),
    ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE_CHOICES)
    document = models.FileField(
        upload_to='pieces/documents/',
        verbose_name="Document (PDF)",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Relations
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    application = models.OneToOneField(
        'Application', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='contract'
    )
    client = models.ForeignKey(
        Person, 
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'client'}
    )
    agent = models.ForeignKey(
        Person,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'agent'},
        related_name='contracts'
    )
    
    class Meta:
        verbose_name = "Contrat"
        verbose_name_plural = "Contrats"
    
    def __str__(self):
        return f"Contrat {self.id}"

class Paiement(models.Model):
    """
    Paiements pour les contrats
    """
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    receipt = models.FileField(
        upload_to='pieces/receipts/',
        verbose_name="Reçu (PDF)"
    )
    
    # Relation
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='payments')
    
    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
    
    def __str__(self):
        return f"Paiement {self.id} - {self.amount}"

class Expense(models.Model):
    """
    Dépenses liées à un contrat (entretien, réparations, etc.)
    """
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_date = models.DateField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.CharField(max_length=255)
    receipt = models.FileField(
        upload_to='pieces/receipts/',
        verbose_name="Reçu (PDF)"
    )
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='expenses',
    )
    
    class Meta:
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"
    
    def __str__(self):
        return f"{self.description} - {self.amount} on {self.expense_date}"