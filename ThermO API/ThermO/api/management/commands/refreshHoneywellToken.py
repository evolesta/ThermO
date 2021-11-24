from django.core.management.base import BaseCommand, CommandError
from api.Honeywell import Honeywell

class Command(BaseCommand):
    help = 'Check if token is still valid, if not, refreshes a new token'

    def handle(self, *args, **options):
        
        if not Honeywell.isTokenValid():
            Honeywell.refreshAccessToken()
        else:
            print('Access Token is still valid, no need to refresh')