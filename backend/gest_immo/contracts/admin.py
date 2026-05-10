from django.contrib import admin
from .models import Contract, Paiement, Expense

admin.site.register(Contract)
admin.site.register(Paiement)
admin.site.register(Expense)
